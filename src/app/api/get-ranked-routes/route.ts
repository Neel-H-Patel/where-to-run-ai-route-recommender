import { NextRequest, NextResponse } from 'next/server';
import Client from "openai";

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
const stravaAccessToken = process.env.STRAVA_ACCESS_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;


// initialize OpenAI client
const client = new Client({ apiKey: openaiApiKey });

// Define types for better type safety
type Route = {
    id: number;
    name: string;
    distance: number;
    elev_difference: number;
    avg_grade: number;
    climb_category: number;
    start_latlng: [number, number];
    end_latlng: [number, number];
    points: string;
};

type Preferences = {
    distance: number;
    safety: string;
    elevation: number;
    terrain: string;
};

type ExtractJsonResult = Route[] | { error: string };

type Weather = {string: string}

// helper functions
async function getCoordinatesFromLocation(location: string): Promise<{ lat: number; lng: number } | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${googleMapsApiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
        return { lat, lng };
    }
    return null;
}

// add radius later to replace 0.05
async function getStravaRoutes(lat: number, lon: number): Promise<Route[]> {
    const bounds = `${lat - 0.05},${lon - 0.05},${lat + 0.05},${lon + 0.05}`;
    const url = `https://www.strava.com/api/v3/segments/explore?bounds=${bounds}&activity_type=running`;

    const headers = {
        Authorization: `Bearer ${stravaAccessToken}`,
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error(`Error fetching routes from Strava: ${response.statusText}`);
    }

    const data = await response.json();
    const segments: Route[] = data.segments || [];

    return segments.map((route) => ({
        id: route.id,
        name: route.name,
        distance: route.distance,
        elev_difference: route.elev_difference,
        avg_grade: route.avg_grade,
        climb_category: route.climb_category,
        start_latlng: route.start_latlng,
        end_latlng: route.end_latlng,
        points: route.points,
    }));
}

async function fetchWeatherData(lat: number, lon: number): Promise<Weather> {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return await response.json();
}

/**
 * Extracts and parses JSON from an AI response, handling unwanted text.
 *
 * @param {string} rawResponse - The raw response string from the AI model.
 * @returns {ExtractJsonResult} Parsed JSON as a list of dictionaries, or an error dictionary if parsing fails.
 */
function extractJsonFromResponse(rawResponse: string): ExtractJsonResult {
    const trimmedResponse = rawResponse.trim();

    // Extract JSON using regex in case there is unwanted text
    const match = /\[.*\]/s.exec(trimmedResponse);

    if (match) {
        const cleanedJson = match[0]; // Extract the JSON part
        try {
            // Convert the cleaned response to a JavaScript object (array or object)
            const parsedData = JSON.parse(cleanedJson);

            if (Array.isArray(parsedData)) {
                return parsedData as Route[]; // Type assertion to Route[]
            } else {
                return { error: "Invalid response format: Expected an array" };
            }
        } catch (error) {
            return { error: `Failed to parse AI response: ${error}` };
        }
    } else {
        return { error: "AI response did not contain valid JSON" };
    }
}

/**
 * Ranks routes based on elevation, safety, and weather conditions using OpenAI.
 *
 * @param {Route[]} routes - A list of route objects.
 * @param {Preferences} preferences - User preferences for route selection.
 * @param {Weather} weather - Weather conditions for the location.
 * @returns {Promise<Route[]>} A promise that resolves with the ranked list of routes.
 */
async function rankRoutes(routes: Route[], preferences: Preferences, weather: Weather): Promise<Route[]> {
    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Given the following preferences, routes, and weather, rank the routes from best to worst. " +
                        "Return ONLY the routes, with all their information, in the order that you ranked them as JSON (no extra text or explanation). Return only the top 3 routes."
                },
                {
                    role: "user",
                    content: `Preferences: ${JSON.stringify(preferences)}\nRoutes: ${JSON.stringify(routes)}\nWeather: ${JSON.stringify(weather)}`
                }
            ]
        });

        if (!completion.choices || completion.choices.length === 0) {
            throw new Error("No routes were ranked.");
        }

        const rawResponse = completion.choices[0].message?.content;
        console.log(rawResponse)
        if (!rawResponse) {
            throw new Error("No content in the completion response.");
        }

        const extractedJson = extractJsonFromResponse(rawResponse);

        if ("error" in extractedJson) {
            throw new Error(`Error extracting JSON: ${extractedJson.error}`);
        }

        return extractedJson as Route[];
    } catch (error) {
        console.error("Error during route ranking:", error);
        throw new Error(`Failed to rank routes: ${error}`);
    }
}


// main Next.js Route Handler
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url);
        const location = searchParams.get('location');
        const distance = parseFloat(searchParams.get('distance') || '5');
        const safety = searchParams.get('safety') || 'high';
        const elevation = parseFloat(searchParams.get('elevation') || '50');
        const terrain = searchParams.get('terrain') || 'road';

        if (!location) {
            return NextResponse.json({ error: 'Location is required' }, { status: 400 });
        }

        const preferences: Preferences = {
            distance: distance * 1000,
            safety: safety,
            elevation: elevation,
            terrain: terrain,
        };

        const coords = await getCoordinatesFromLocation(location);
        if (!coords) {
            return NextResponse.json({ error: 'Invalid location provided' }, { status: 400 });
        }

        const { lat, lng } = coords;

        const weather = await fetchWeatherData(lat, lng);
        if (!weather) {
            return NextResponse.json({ error: 'Could not retrieve weather data' }, { status: 500 });
        }

        const routes = await getStravaRoutes(lat, lng);

        const rankedRoutes = await rankRoutes(routes, preferences, weather);
        return NextResponse.json(rankedRoutes);

    } catch (error) {
        console.error("Error in /get-ranked-routes:", error);
        return NextResponse.json({ error: error || 'Internal Server Error' }, { status: 500 });
    }
}
