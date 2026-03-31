from pydantic import BaseModel
from typing import List

class DistrictResponse(BaseModel):
    name: str
    lat: float
    lng: float
    vulnerability: str
    risks: List[str]

class WeatherResponse(BaseModel):
    location: str
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: int
    weather_main: str
    weather_description: str
    visibility: int
    sunrise: str
    sunset: str
    fetched_at: str

class ClimateAnalysisRequest(BaseModel):
    location: str
    weather: WeatherResponse

class ClimateAnalysisResponse(BaseModel):
    analysis: str
    location: str
