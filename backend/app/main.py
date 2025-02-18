from fastapi import FastAPI, Query
import requests
import os
from typing import List, Dict
from dotenv import load_dotenv
import overpass

app = FastAPI()

load_dotenv()
overpass_api = overpass.API()

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
    coords = get_coordinates_from_location(location)

    # Step 1: Get routes from OpenStreetMap
    routes = fetch_routes_from_osm(coords, distance, terrain)

    # Step 2: Get safety data from Google Maps (if requested)
    if safety:
        routes = fetch_safety_data(routes, location)

    # Step 3: Get weather data
    weather = fetch_weather_data(location)

    # Step 4: Rank routes based on elevation, safety, and weather
    ranked_routes = rank_routes(routes, elevation, weather)

    return {"routes": ranked_routes}


def get_coordinates_from_location(location: str) -> str:
    """Convert a place name to coordinates using Google Maps Geocoding API"""
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url).json()
    if response["status"] == "OK":
        lat = response["results"][0]["geometry"]["location"]["lat"]
        lon = response["results"][0]["geometry"]["location"]["lng"]
        return f"{lat},{lon}"
    return ""

def fetch_routes_from_osm(location: str, distance: float, terrain: str) -> List[Dict]:
    """Fetch running routes from OpenStreetMap using Overpass API"""
    query = f'node["name"="{location}"];'
    response = overpass_api.get(query)
    print(response)
    routes = [
        {"name": feature["properties"].get("name", "Unknown"), "id": feature["id"]}
        for feature in response.get("features", [])
    ]
    print(routes)
    return routes


def fetch_safety_data(routes: List[Dict], location: str) -> List[Dict]:
    """Fetch safety data from Google Maps API"""
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={location}&radius=5000&type=police_station&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url)
    safety_data = response.json()

    for route in routes:
        print(safety_data)
        route["safety_score"] = len(safety_data.get("results", []))
    return routes


def fetch_weather_data(location: str) -> Dict:
    """Fetch weather conditions from OpenWeather API"""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    return response.json() if response.status_code == 200 else {}


def rank_routes(routes: List[Dict], elevation_pref: str, weather: Dict) -> List[Dict]:
    """Rank routes based on elevation, safety, and weather conditions."""
    for route in routes:
        route["score"] = 10  # Placeholder ranking logic
    return sorted(routes, key=lambda x: x["score"], reverse=True)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
