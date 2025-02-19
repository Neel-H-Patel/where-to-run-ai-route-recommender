import axios from "axios";
import { Route } from "./types";

const API_BASE_URL = "http://localhost:8000";


export const fetchRoutes = async (
    location: string,
    distance = 5.0,
    safety = "high",
    elevation = 50.0,
    terrain = "road"
): // @ts-ignore
    Promise<Route[]> => {
    try {
        const response = await axios.get<Route[]>(`${API_BASE_URL}/get-ranked-routes`, {
            params: { location, distance, safety, elevation, terrain },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching routes:", error);
        return []; // Return empty array on error to prevent crashes
    }
};


// preferences need to look like this:
// preferences.location,
// preferences.distance,
// preferences.safety,
// preferences.elevation,
// preferences.terrain
