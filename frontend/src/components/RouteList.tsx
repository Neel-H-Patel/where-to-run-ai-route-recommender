import React from "react";
import { Route } from "../types";

interface RouteListProps {
    routes: Route[];
    loading: boolean;
}

const RouteList: React.FC<RouteListProps> = ({ routes, loading }) => {
    return (
        <div>
            <h2>Route Recommendations</h2>
            {loading && <p>Loading routes...</p>}
            {!loading && routes.length === 0 && <p>No routes found. Try adjusting your filters.</p>}
            {!loading && routes.length > 0 && (
                <ul>
                    {routes.map((route) => (
                        <li key={route.id}>
                            <b>{route.name}</b> - {(route.distance / 1000).toFixed(1)} km, {route.elevation_gain} m elevation gain
                            <br />Avg Grade: {route.avg_grade}%, Climb Category: {route.climb_category}
                            <br />Start: {route.start_latlng[0]}, {route.start_latlng[1]}
                            <br />End: {route.end_latlng[0]}, {route.end_latlng[1]}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RouteList;
