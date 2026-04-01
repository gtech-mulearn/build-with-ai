## Project Name
FairLend: AI-Powered Bank Internal Bias Auditor

## Problem Statement
Traditional banking algorithms and legacy datasets often contain "hidden" discrimination based on gender, age, or nationality. These biases are frequently baked into historical decision-making data. If used to train new AI models without auditing, they perpetuate systemic inequality. Banks lack a terminal-first, agentic tool to audit this internal data for compliance with fairness standards (like the EEOC 80% Rule).

## Project Description
Describe your solution, how it works, and what makes it useful.

---

## Google AI Usage
### Tools / Models Used
- Gemini said
Since you are submitting to Track 2: High Code, your README needs to strike a balance between high-level impact (banking ethics) and technical depth (agentic orchestration).

Here is the completed documentation for your Bias Auditor AI, formatted exactly as you requested.

FairLend: AI-Powered Bank Internal Bias Auditor
Problem Statement
Traditional banking algorithms and legacy datasets often contain "hidden" discrimination based on gender, age, or nationality. These biases are frequently baked into historical decision-making data. If used to train new AI models without auditing, they perpetuate systemic inequality. Banks lack a terminal-first, agentic tool to audit this internal data for compliance with fairness standards (like the EEOC 80% Rule).

Project Description
FairLend is a multi-service auditor that allows bank compliance officers to upload internal loan decision data and receive an instant bias audit.

Automated Statistical Audit: Calculates the Disparate Impact Ratio using Python logic to flag high-risk lending patterns.

Agentic Mitigation: Instead of just showing charts, FairLend uses an AI Agent to interpret biased rows and suggest specific policy changes to rectify discrimination.

Terminal-First Workflow: Built for developers and technical auditors to deploy instantly across cloud environments.

Google AI Usage
Tools / Models Used
Gemini 1.5 Pro: Used as the core reasoning engine for the Audit Agent.

Vertex AI: Serves as the backend for the Gemini API to provide enterprise-grade rate limits and data privacy.

Gemini CLI: Used for terminal-first orchestration and deployment.

Antigravity: Used to manage the agentic "skills" and multi-service architecture.

### How Google AI Was Used
Explain clearly how AI is integrated into your project.

---AI is integrated at two critical levels:

Agentic Interpretation: When a "High Bias" status is detected (DIR < 0.8), the system passes the biased data subset to Gemini 1.5 Pro. The model acts as a "Mitigation Agent" to explain why the bias exists and how to re-weight those variables.

Natural Language Querying: Users can use the agent interface to ask complex questions about the dataset, such as "How would rejection rates change if we ignored the 'personal_status_sex' attribute?"

## Proof of Google AI Usage
Attach screenshots in a `/proof` folder:

![AI Proof](./proof/screenshot1.png)

---

## Screenshots 
Add project screenshots:

![Screenshot1](./assets/screenshot1.png)  
![Screenshot2](./assets/screenshot2.png)

---

## Demo Video
Upload your demo video to Google Drive and paste the shareable link here(max 3 minutes).
[Watch Demo](#)

---

## Installation Steps

```bash
#Final Submission Tips:
The /proof Folder: Create a folder in your GitHub repo named proof and put a screenshot of your Google AI Studio or your Vertex AI Console inside it.

The requirements.txt: If you are using Streamlit or Cloud Run, make sure you have a requirements.txt file (not npm install for Python projects).

The Biased Data: Don't forget to include the three CSV files I gave you earlier (Bank_High_Bias.csv, etc.) in the repo so the judges can test it immediately! Clone the repository
git clone <your-repo-link>

# Go to project folder
cd project-name

# Install dependencies
npm install

# Run the project
npm start
