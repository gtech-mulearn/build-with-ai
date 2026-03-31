
## Problem Statement
AI for Sustainable Futures

Design a climate-change impact visualizer for Kerala's coastal communities


## Project Description
The Kerala Coastal Climate Impact Visualizer is an interactive web application that provides real-time weather information and high-quality, AI-generated climate impact forecasts for Kerala's 9 coastal districts (or a user's exact live location). 

By combining an interactive Google Map with the OpenWeatherMap API and Google's Gemini AI, the app gives tailored insights into short-term and long-term coastal vulnerability, offering instantaneous, actionable precautions based on live meteorological data.

## Google AI Usage
**Tools / Models Used:** Google Gemini API (`gemini-2.5-flash`)

**How Google AI Was Used:** 
The Gemini API acts as the core climate intelligence engine. When a user clicks a location on the map, the backend fetches live meteorological data (temperature, humidity, wind speed, condition) and injects it into a meticulously structured prompt. Gemini then synthesizes this live context and generates a structured markdown report outlining short-term risks, long-term projections (like shoreline erosion rates), government policy recommendations, and immediate actionable precautions for residents.

## Proof of Google AI Usage
*(Attach screenshots in a `/proof` folder here)*
- [AI Proof](proof/ai-proof.png)

## Screenshots
*(Add project screenshots here)*
- [Screenshot 1](proof/screenshot1.png)
- [Screenshot 2](proof/screenshot2.png)

## Demo Video
*(Upload your demo video to Google Drive and paste the shareable link here)*
[Watch Demo](https://drive.google.com/...)

## Installation Steps
```bash
# Clone the repository
git clone <your-repo-link>

# Go to project folder
cd kerala-climate-visualizer

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Create .env based on the example and add your API keys
# OWM_API_KEY, GEMINI_API_KEY, GOOGLE_MAPS_KEY
cp ../.env.example ../.env

# Run the FastAPI Backend
uvicorn main:app --reload --port 8000

# Open a new terminal, run the frontend
cd ../frontend
python -m http.server 5500
```
Open `http://localhost:5500` in your browser.
