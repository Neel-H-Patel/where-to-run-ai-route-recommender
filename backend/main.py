import httpx
from fastapi import FastAPI, Query, HTTPException
import os
from dotenv import load_dotenv
import requests
from typing import List, Dict, Tuple, Optional, Any, Union
from openai import OpenAI
import json
import re
from fastapi.middleware.cors import CORSMiddleware

# load environment variables
load_dotenv()

# initialize backend
app = FastAPI()

# deal with CORS errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# get API keys from env variables
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
STRAVA_ACCESS_TOKEN = os.getenv("STRAVA_ACCESS_TOKEN")
STRAVA_API_URL = "https://www.strava.com/api/v3"

# set up client
client = OpenAI(api_key=OPENAI_API_KEY)

# very accurately gets the lat and lng coordinates of any location.
# Be as specific as possible with your current location.
def get_coordinates_from_location(location: str) -> Optional[Tuple[float, float]]:
    """Convert a place name to coordinates using Google Maps Geocoding API"""
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url).json()
    if response["status"] == "OK":
        lat = response["results"][0]["geometry"]["location"]["lat"]
        lon = response["results"][0]["geometry"]["location"]["lng"]
        return lat, lon
    return None

@app.get("/strava/routes")
async def get_strava_routes(lat: float, lon: float, radius: float = 5.0) -> List[Dict]:
    """
    Fetch public running routes near a given location.
    - `lat`: Latitude of search center
    - `lon`: Longitude of search center
    - `radius`: Search radius in km (default: 5km)
    """

    # Convert radius to bounding box (roughly, ±0.05 degrees ≈ 5km)
    bounds = f"{lat - 0.05},{lon - 0.05},{lat + 0.05},{lon + 0.05}"

    url = f"{STRAVA_API_URL}/segments/explore"

    headers = {"Authorization": f"Bearer {STRAVA_ACCESS_TOKEN}"}
    params = {"bounds": bounds, "activity_type": "running"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching routes from Strava")

        data = response.json().get("segments", [])

        # Extract only the required keys
        filtered_routes = [
            {
                "id": route["id"],
                "name": route["name"],
                "distance": route["distance"],
                "elev_difference": route["elev_difference"],  # Adjust based on API response
                "avg_grade": route["avg_grade"],
                "climb_category": route["climb_category"],
                "start_latlng": route["start_latlng"],
                "end_latlng": route["end_latlng"],
                "points": route["points"],  # Renaming polyline to points
            }
            for route in data
        ]

        return filtered_routes


def get_temp_routes() -> List[Dict]:
    """Generate temporary running routes for testing."""
    return [
        {
            "id": 1,
            "name": "City Park Loop",
            "distance": 4800,  # meters
            "elevation_gain": 50,
            "avg_grade": 2.1,
            "climb_category": 0,
            "start_latlng": [40.73061, -73.935242],
            "end_latlng": [40.73581, -73.935242],
            "polyline": "s|wF|nqbM?`@Dl@Dx@Hv@Jr@Pt@dA|AxAbBl@`A"
        },
        {
            "id": 2,
            "name": "Riverfront Jogging Path",
            "distance": 5200,
            "elevation_gain": 30,
            "avg_grade": 1.5,
            "climb_category": 0,
            "start_latlng": [40.7210, -74.0100],
            "end_latlng": [40.7250, -74.0100],
            "polyline": "o|wFdvqbM?^Bb@F`@Jr@Px@Vx@Xx@"
        },
        {
            "id": 3,
            "name": "Mountain Trail Run",
            "distance": 8400,
            "elevation_gain": 200,
            "avg_grade": 6.3,
            "climb_category": 1,
            "start_latlng": [40.8001, -74.0100],
            "end_latlng": [40.8051, -74.0150],
            "polyline": "q|wFvzrbMD`@Jt@Rx@Zx@^z@"
        }
    ]

# may be unnecessary as it correlates with popularity closely (inversely though)
def fetch_safety_data(routes: List[Dict], lat, lon):
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
                "content": f"location: {lat, lon}\n routes: {routes}\n"
            }
        ]
    )

    return extract_json_from_response(completion.choices[0].message.content)

# gets the weather for whatever location you're currently at/whatever location you inputted
def fetch_weather_data(lat: float, lon: float) -> Dict:
    """Fetch weather conditions from OpenWeather API using coordinates."""
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}"
    response = requests.get(url)
    return response.json() if response.status_code == 200 else {"error": "Failed to fetch weather data"}

def rank_routes(routes: List[Dict], preferences: Dict, weather: Dict):
    """Rank routes based on elevation, safety, and weather conditions."""
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Given the following preferences, routes, and weather, rank the routes from "
                                          "best to worst. Return only the routes with all their info in the order that you ranked them"
                                          " as JSON (no explanation). Return only the top 3 routes."},
            {
                "role": "user",
                "content": f"Preferences: {preferences}\n routes: {routes}\n weather: {weather}"
            }
        ]
    )

    return extract_json_from_response(completion.choices[0].message.content)


def extract_json_from_response(raw_response: str) -> Union[List[Dict[str, Any]], Dict[str, str]]:
    """
    Extracts and parses JSON from an AI response, handling unwanted text.

    Args:
        raw_response (str): The raw response string from the AI model.

    Returns:
        Union[List[Dict[str, Any]], Dict[str, str]]: Parsed JSON as a list of dictionaries,
        or an error dictionary if parsing fails.
    """

    raw_response = raw_response.strip()  # Remove any leading/trailing whitespace

    # Extract JSON using regex in case there is unwanted text
    match = re.search(r"\[.*\]", raw_response, re.DOTALL)

    if match:
        cleaned_json = match.group(0)  # Extract the JSON part
    else:
        return {"error": "AI response did not contain valid JSON"}

    try:
        # Convert the cleaned response to a Python list
        parsed_data = json.loads(cleaned_json)

        if isinstance(parsed_data, list):
            return parsed_data
        else:
            return {"error": "Invalid response format"}

    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response"}

@app.get("/get-ranked-routes")
async def get_ranked_routes(
    location: str,
    distance: float = Query(5.0, description="Preferred route distance in km"),
    safety: str = Query("high", description="Preferred safety level: low, moderate, high"),
    elevation: float = Query(50.0, description="Preferred elevation gain in meters"),
    terrain: str = Query("road", description="Preferred terrain type: trail, road, park")
) -> Union[List[Dict[str, Any]], Dict[str, str]]:
    """
    Master function: Gets coordinates, weather, safety data, and returns ranked routes.
    """

    # Step 1: Convert preferences into a dictionary
    preferences = {
        "distance": distance * 1000,
        "safety": safety,
        "elevation": elevation,
        "terrain": terrain
    }

    # Step 2: Get coordinates
    coords = get_coordinates_from_location(location)
    if not coords:
        return {"error": "Invalid location provided"}

    lat, lon = coords
    print(lat, lon)

    # Step 3: Get weather data
    weather = fetch_weather_data(lat, lon)
    if "error" in weather:
        return {"error": "Could not retrieve weather data"}

    # Step 4: Get running routes from Strava for current location
    routes = await get_strava_routes(lat, lon)

    # # Step 5: Fetch safety scores
    # routes_with_safety = fetch_safety_data(routes, lat, lon)
    # if isinstance(routes_with_safety, dict) and "error" in routes_with_safety:
    #     return routes_with_safety  # Return error if safety data fails

    # Step 6: Rank routes based on user preferences
    ranked_routes = rank_routes(routes, preferences, weather)
    if isinstance(ranked_routes, dict) and "error" in ranked_routes:
        return ranked_routes  # Return error if ranking fails

    return ranked_routes



if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8080))  # Read from env variable
    uvicorn.run(app, host="0.0.0.0", port=port)