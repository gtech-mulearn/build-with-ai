import google.generativeai as genai
from fastapi import HTTPException
from config import GEMINI_API_KEY
from models import ClimateAnalysisRequest, ClimateAnalysisResponse

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def generate_climate_analysis(request: ClimateAnalysisRequest) -> ClimateAnalysisResponse:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
    model = genai.GenerativeModel("gemini-2.5-flash")
    w = request.weather
    
    prompt = f"""You are a coastal climate scientist specializing in Kerala, India.
Analyze the climate impact for {request.location}, Kerala.

CRITICAL INSTRUCTIONS:
1. Keep your entire response extremely precise, short, and to the point.
2. You MUST explicitly mention and base your analysis heavily on the following CURRENT WEATHER CONDITIONS:
- Temperature: {w.temperature}°C (Min: {w.temp_min}°C, Max: {w.temp_max}°C)
- Humidity: {w.humidity}%
- Wind: {w.wind_speed} m/s at {w.wind_deg}°
- Condition: {w.weather_description}
- Pressure: {w.pressure} hPa
- Visibility: {w.visibility} m

Provide a structured analysis with these exact sections:


## 🛡️ Immediate Weather Precautions
3-5 short, actionable precautions people should take right now specifically based on the current weather ({w.weather_description}, {w.temperature}°C, {w.wind_speed} m/s wind).

## 🏛️ Government Recommendations
2-3 brief policy interventions.

## 🌊 Short-Term Outlook 
Specific risks: sea level rise, flooding likelihood, temperature anomalies. Keep it briefed.

## 🔮 Long-Term Projections 
Coastal erosion rates, displacement risk, ecosystem threats. Keep it brief.

## ⚠️ Vulnerability Rating
Rate as: Low / Moderate / High / Critical. Ensure the rating is just one word, followed by a one-sentence justification.
"""

    try:
        response = model.generate_content(prompt)
        return ClimateAnalysisResponse(
            analysis=response.text,
            location=request.location
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
