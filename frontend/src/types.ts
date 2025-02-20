export interface Route {
    id: number;
    name: string;
    distance: number; // in meters
    elev_difference: number; // in meters
    avg_grade: number; // percentage
    climb_category: number;
    start_latlng: [number, number]; // Latitude, Longitude
    end_latlng: [number, number]; // Latitude, Longitude
    points: string; // Encoded polyline for map rendering
}
