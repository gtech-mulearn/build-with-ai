require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const ai = new GoogleGenAI({});

// Define strict JSON schema to guarantee backend stability
const scanResponseSchema = {
    type: "OBJECT",
    properties: {
        risk_score: { type: "NUMBER", description: "0-100 risk score" },
        verdict: { type: "STRING", description: "Safe, Suspicious, or Scam" },
        manipulation_tactics: { type: "ARRAY", items: { type: "STRING" }, description: "Psychological tactics used" },
        attacker_intent: { type: "STRING" },
        target_victim: { type: "STRING" },
        explanation: { type: "STRING" },
        highlighted_phrases: { type: "ARRAY", items: { type: "STRING" } },
        threat_origin: {
            type: "OBJECT",
            properties: {
                ip: { type: "STRING" },
                location: { type: "STRING" },
                registrar: { type: "STRING" }
            },
            required: ["ip", "location", "registrar"]
        }
    },
    required: ["risk_score", "verdict", "manipulation_tactics", "attacker_intent", "target_victim", "explanation", "highlighted_phrases", "threat_origin"]
};

app.post('/api/analyze', async (req, res) => {
    try {
        const { text, lang = 'en' } = req.body;
        if (!text) return res.status(400).json({ error: 'Text or URL is required for analysis' });

        const languageInstruction = lang === 'ml' 
            ? "You must translate ONLY the 'manipulation_tactics', 'attacker_intent', 'target_victim', 'explanation', and 'verdict' into Malayalam strings. The JSON keys and threat_origin MUST remain in English strings." 
            : "";

        const systemInstruction = `You are an elite Psychological Fraud Detection Engine & Digital Forensic Analyst. 
Analyze the following text message, email, or URL mimicking Indian scam models (e.g., UPI, Lottery, Bank KYC, Jobs).

Identify the psychological factors: Fear/Urgency, Greed, Authority Impersonation.
Generate a simulated, highly-realistic 'threat_origin' forensic trace based on where such scams usually originate or host their fake links, to act as realistic demo data.

${languageInstruction}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this payload using your forensic AI parameters:\n\n"${text}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: scanResponseSchema, // Enforces the exact JSON structure
                temperature: 0.1
            }
        });

        // Safe direct parse, Schema guarantees format
        const result = JSON.parse(response.text);
        res.json({ analysis: result });

    } catch (error) {
        console.error('Error in /api/analyze:', error.message);
        res.status(500).json({ error: 'Gemini API Error: ' + error.message + '. Ensure your API key is correct in .env!' });
    }
});

// New Endpoint: AI FIR Generator
app.post('/api/generate-fir', async (req, res) => {
    try {
        const { name, phone, scamType, amount, description } = req.body;
        
        const systemInstruction = `You are an elite, highly professional Cyber Crime Police Officer working for the National Cyber Crime Reporting Portal (NCRP) of India.
Your job is to read the raw input provided by a victim of cyber fraud and generate a perfectly structured, formal, and legally sound 'First Information Report' (FIR) draft.

Follow this strict format:
[HEADER]
To,
The Cyber Cell In-Charge,
[Leave Blank for Location]

Subject: Official Complaint regarding Cyber Fraud / ${scamType}

[BODY]
Respected Sir/Madam,
I, [Victim Name], holding phone number [Phone], state the following:
(Convert the user's messy story into a highly formal, chronological incident report).

[EVIDENCE]
(List any evidence mentioned, e.g., "Attached screenshots of WhatsApp chat", "Bank statement showing loss of [Amount]", etc. If no amount is given, do not invent one).

[PRAYER]
I humbly request you to register this FIR under the Information Technology Act, 2000 and initiate immediate action to freeze the attacker's accounts and recover any funds.

Yours faithfully,
[Victim Name]
[Phone]`;

        const prompt = `Raw victim input data:
Name: ${name}
Phone: ${phone}
Scam Type: ${scamType}
Amount Lost: ${amount || 'Not specified'}
Victim's Description: ${description}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2 // Keep it highly professional and rigid
            }
        });

        res.json({ firText: response.text });
    } catch (error) {
        console.error("FIR Generation Error:", error.message);
        res.status(500).json({ error: { message: "Failed to generate FIR draft. Please try again." } });
    }
});

app.listen(PORT, () => console.log(`🚀 ScamShield AI running on http://localhost:${PORT}`));
