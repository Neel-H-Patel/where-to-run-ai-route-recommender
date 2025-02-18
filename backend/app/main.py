from fastapi import FastAPI, Query
import requests
import os
from typing import List, Dict
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()

# API Keys (Set these as environment variables in production)
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


@app.get("/routes")
def get_running_routes(
        location: str,
        distance: float = Query(..., description="Distance in km"),
        terrain: str = Query("road", description="Preferred terrain: road, trail, park"),
        elevation: str = Query("moderate", description="Elevation preference: flat, moderate, steep"),
        safety: bool = Query(True, description="Consider safety data")
):
    """
    Fetch and rank running routes based on user preferences.
    """
    # Step 1: Get routes from OpenStreetMap (Mock data for now)
    routes = fetch_routes_from_osm(location, distance, terrain)

    # Step 2: Get safety data from Google Maps (if requested)
    if safety:
        routes = fetch_safety_data(routes)

    # Step 3: Get weather data
    weather = fetch_weather_data(location)

    # Step 4: Rank routes based on elevation, safety, and weather
    ranked_routes = rank_routes(routes, elevation, weather)

    return {"routes": ranked_routes}


def fetch_routes_from_osm(location: str, distance: float, terrain: str) -> List[Dict]:
    """Fetch running routes from OpenStreetMap (Mock implementation)"""
    return [
        {"name": "Park Loop", "distance": 5, "terrain": "park", "elevation": "flat"},
        {"name": "Hill Trail", "distance": 7, "terrain": "trail", "elevation": "steep"},
    ]


def fetch_safety_data(routes: List[Dict]) -> List[Dict]:
    """Fetch safety data from Google Maps API (Mock implementation)"""
    for route in routes:
        route["safety_score"] = 8  # Mock safety score
    return routes


def fetch_weather_data(location: str) -> Dict:
    """Fetch weather conditions from OpenWeather API"""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    print(response.json() if response.status_code == 200 else "None")
    return response.json() if response.status_code == 200 else {}


def rank_routes(routes: List[Dict], elevation_pref: str, weather: Dict) -> List[Dict]:
    """Rank routes based on elevation, safety, and weather conditions."""
    for route in routes:
        route["score"] = 10  # Placeholder ranking logic
    return sorted(routes, key=lambda x: x["score"], reverse=True)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
