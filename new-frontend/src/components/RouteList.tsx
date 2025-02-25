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
        <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-md w-full md:w-1/2 max-w-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Route Recommendations</h2>
            {loading && <p className="text-gray-500 dark:text-gray-400">Loading routes...</p>}
            {!loading && routes.length === 0 && <p className="text-gray-500 dark:text-gray-400">No routes found. Try adjusting your filters.</p>}
            {!loading && routes.length > 0 && (
                <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                    {routes.map((route) => (
                        <li
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`p-4 cursor-pointer transition-all rounded-md ${
                                selectedRoute?.id === route.id
                                    ? "bg-blue-100 dark:bg-blue-700"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            <b className="text-gray-900 dark:text-gray-100">{route.name}</b> - {(route.distance / 1000).toFixed(1)} km, {route.elev_difference} m elevation gain
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
