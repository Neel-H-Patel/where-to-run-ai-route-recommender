'use client';

import { Route } from "@/types";

interface RouteListProps {
    routes: Route[];
    loading: boolean;
    selectedRoute: Route | null;
    setSelectedRoute: (route: Route | null) => void;
}

const RouteList: React.FC<RouteListProps> = ({ routes, loading, selectedRoute, setSelectedRoute }) => {
    return (
        <div className="p-4 bg-white shadow rounded-md w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Route Recommendations</h2>
            {loading && <p className="text-gray-500">Loading routes...</p>}
            {!loading && routes.length === 0 && <p className="text-gray-500">No routes found. Try adjusting your filters.</p>}
            {!loading && routes.length > 0 && (
                <ul className="divide-y divide-gray-200">
                    {routes.map((route) => (
                        <li
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`p-4 cursor-pointer ${selectedRoute?.id === route.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                        >
                            <b>{route.name}</b> - {(route.distance / 1000).toFixed(1)} km, {route.elev_difference} m elevation gain
                            <br/>Avg Grade: {route.avg_grade}%, Climb Category: {route.climb_category}
                            <br/>Start: {route.start_latlng[0]}, {route.start_latlng[1]}
                            <br/>End: {route.end_latlng[0]}, {route.end_latlng[1]}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RouteList;
