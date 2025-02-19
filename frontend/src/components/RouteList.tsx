import React, { useState } from "react";
import { fetchRoutes } from "../api";
import { Route } from "../types";

const RouteList: React.FC = () => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const getRoutes = async () => {
        setLoading(true);
        const fetchedRoutes = await fetchRoutes("New York, NY", 5.0, "high", 50.0, "road");
        setRoutes(fetchedRoutes);
        setLoading(false);
    };

    return (
        <div>
            <h2>Route Recommendations</h2>
            <button onClick={getRoutes} disabled={loading}>
                {loading ? "Loading..." : "Fetch Routes"}
            </button>

            {routes.length > 0 ? (
                <ul>
                    {routes.map((route: Route) => (
                        <li key={route.id}>
                            <b>{route.name}</b> - {(route.distance / 1000).toFixed(1)} km, {route.elevation_gain} m elevation gain
                            <br />Avg Grade: {route.avg_grade}%, Climb Category: {route.climb_category}
                            <br />Start: {route.start_latlng[0]}, {route.start_latlng[1]}
                            <br />End: {route.end_latlng[0]}, {route.end_latlng[1]}
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No routes found. Try adjusting your filters.</p>
            )}
        </div>
    );
};

export default RouteList;
