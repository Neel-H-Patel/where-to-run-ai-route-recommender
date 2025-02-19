export interface Route {
    id: number;
    name: string;
    distance: number; // in meters
    elevation_gain: number; // in meters
    avg_grade: number; // percentage
    climb_category: number;
    start_latlng: [number, number]; // Latitude, Longitude
    end_latlng: [number, number]; // Latitude, Longitude
    polyline: string; // Encoded polyline for map rendering
}
