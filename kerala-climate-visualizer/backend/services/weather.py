import httpx
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from config import OWM_API_KEY
from models import WeatherResponse

async def fetch_weather(location: str | None = None, lat: float | None = None, lng: float | None = None) -> WeatherResponse:
    if not OWM_API_KEY:
        raise HTTPException(status_code=500, detail="OpenWeatherMap API key not configured")
        
    if lat is not None and lng is not None:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OWM_API_KEY}&units=metric"
    elif location:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={location},Kerala,IN&appid={OWM_API_KEY}&units=metric"
    else:
        raise HTTPException(status_code=400, detail="Must provide either location or lat/lng")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Location not found")
        elif response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching weather data")
            
        data = response.json()
        
        def format_time(ts: int) -> str:
            dt = datetime.fromtimestamp(ts, tz=timezone.utc) + timedelta(hours=5, minutes=30)
            return dt.strftime("%H:%M IST")
            
        return WeatherResponse(
            location=data.get("name", location),
            temperature=data["main"]["temp"],
            feels_like=data["main"]["feels_like"],
            temp_min=data["main"]["temp_min"],
            temp_max=data["main"]["temp_max"],
            humidity=data["main"]["humidity"],
            pressure=data["main"]["pressure"],
            wind_speed=data["wind"]["speed"],
            wind_deg=data["wind"]["deg"],
            weather_main=data["weather"][0]["main"],
            weather_description=data["weather"][0]["description"],
            visibility=data.get("visibility", 10000),
            sunrise=format_time(data["sys"]["sunrise"]),
            sunset=format_time(data["sys"]["sunset"]),
            fetched_at=datetime.now(timezone.utc).isoformat()
        )
