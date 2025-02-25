export interface Route {
    id: number;
    name: string;
    distance: number; // Distance in meters
    elev_difference: number; // Elevation difference in meters
    avg_grade: number; // Percentage
    climb_category: number;
    start_latlng: [number, number]; // [Latitude, Longitude]
    end_latlng: [number, number]; // [Latitude, Longitude]
    points: string; // Encoded polyline for map rendering
}
