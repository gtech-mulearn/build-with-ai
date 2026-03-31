from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import DistrictResponse, WeatherResponse, ClimateAnalysisRequest, ClimateAnalysisResponse
from services.weather import fetch_weather
from services.gemini import generate_climate_analysis

app = FastAPI(title="Kerala Coastal Climate Impact Visualizer API")

# Enable CORS for all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DISTRICTS = [
  { "name": "Thiruvananthapuram", "lat": 8.3980,  "lng": 76.9786, "vulnerability": "high",     "risks": ["sea level rise", "beach erosion", "urban flooding"] }, # Kovalam/shore
  { "name": "Kollam",             "lat": 8.8853,  "lng": 76.5714, "vulnerability": "high",     "risks": ["coastal erosion", "fishing community displacement"] }, # Kollam beach
  { "name": "Alappuzha",          "lat": 9.4925,  "lng": 76.3175, "vulnerability": "critical", "risks": ["extreme flooding", "backwater salinity intrusion", "land loss"] }, # Alappuzha beach
  { "name": "Ernakulam",          "lat": 9.9658,  "lng": 76.2421, "vulnerability": "moderate", "risks": ["urban flooding", "port area inundation"] }, # Fort Kochi
  { "name": "Thrissur",           "lat": 10.3725, "lng": 76.0461, "vulnerability": "moderate", "risks": ["riverine flooding", "storm surges"] }, # Chavakkad beach
  { "name": "Malappuram",         "lat": 10.8037, "lng": 75.9221, "vulnerability": "moderate", "risks": ["coastal erosion", "groundwater salinity"] }, # Ponnani
  { "name": "Kozhikode",          "lat": 11.2618, "lng": 75.7667, "vulnerability": "moderate", "risks": ["beach erosion", "monsoon flooding"] }, # Kozhikode beach
  { "name": "Kannur",             "lat": 11.8590, "lng": 75.3262, "vulnerability": "low",      "risks": ["coastal erosion", "wind damage"] }, # Payyambalam beach
  { "name": "Kasaragod",          "lat": 12.3899, "lng": 75.0210, "vulnerability": "low",      "risks": ["beach erosion", "saltwater intrusion"] } # Bekal area
]

@app.get("/api/districts", response_model=List[DistrictResponse])
async def get_districts():
    return DISTRICTS

@app.get("/api/weather", response_model=WeatherResponse)
async def get_weather(location: str | None = None, lat: float | None = None, lng: float | None = None):
    return await fetch_weather(location, lat, lng)

@app.post("/api/climate-analysis", response_model=ClimateAnalysisResponse)
async def post_climate_analysis(request: ClimateAnalysisRequest):
    return await generate_climate_analysis(request)
