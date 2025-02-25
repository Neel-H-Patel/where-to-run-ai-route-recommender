import axios from "axios";
import { Route } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Fetch ranked routes based on user preferences.
 * @param location - User's selected location.
 * @param distance - Distance in kilometers (default: 5.0).
 * @param safety - Safety preference (default: "high").
 * @param elevation - Elevation gain in meters (default: 50.0).
 * @param terrain - Type of terrain (default: "road").
 * @returns A list of recommended routes.
 */
export const fetchRoutes = async (
    location: string,
    distance: number = 5.0,
    safety: string = "high",
    elevation: number = 50.0,
    terrain: string = "road"
): Promise<Route[]> => {
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