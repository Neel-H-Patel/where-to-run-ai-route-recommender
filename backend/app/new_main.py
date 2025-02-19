from fastapi import FastAPI, Query
import os
from dotenv import load_dotenv
import requests
from typing import List, Dict
from openai import OpenAI

# load environment variables
load_dotenv()

# initialize backend
app = FastAPI()

# get API keys from env variables
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# set up client
client = OpenAI(api_key=OPENAI_API_KEY)

# very accurately gets the lat and lng coordinates of any location.
# Be as specific as possible with your current location.
@app.get("/get-coords")
def get_coordinates_from_location(location: str) -> str:
    """Convert a place name to coordinates using Google Maps Geocoding API"""
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url).json()
    if response["status"] == "OK":
        lat = response["results"][0]["geometry"]["location"]["lat"]
        lon = response["results"][0]["geometry"]["location"]["lng"]
        return f"{lat},{lon}"
    return ""

@app.get("/temp-routes")
def get_temp_routes() -> List[Dict]:
    """Generate temporary running routes for testing."""
    return [
        {"id": 1, "name": "City Park Loop", "distance": 5.2, "elevation": 50, "popularity": 80},
        {"id": 2, "name": "Mountain Trail Run", "distance": 8.4, "elevation": 200, "popularity": 65},
        {"id": 3, "name": "Riverfront Jogging Path", "distance": 4.8, "elevation": 30, "popularity": 90},
        {"id": 4, "name": "Downtown Scenic Route", "distance": 6.1, "elevation": 20, "popularity": 70}
    ]

# may be unnecessary as it correlates with popularity closely (inversely though)
@app.post("/safety-data")
def fetch_safety_data(routes: List[Dict], location: str):
    """Fetch safety data from Google Maps API"""
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Given the following routes and the location, determine a safety score "
                                          "ranging from 1 to 5 (decimals are fine up to 1 place) for each route and "
                                          "return the route object again adding 'safety_score' as a key. Return only "
                                          "the routes as JSON (no explanation)"},
            {
                "role": "user",
                "content": f"location: {location}\n routes: {routes}\n"
            }
        ]
    )

    return completion.choices[0].message.content


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)