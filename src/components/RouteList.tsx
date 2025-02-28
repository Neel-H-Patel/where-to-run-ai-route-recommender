'use client';

import { Route } from "@/types";
import React from "react";

interface RouteListProps {
    routes: Route[];
    loading: boolean;
    selectedRoute: Route | null;
    setSelectedRoute: (route: Route | null) => void;
}

const RouteList: React.FC<RouteListProps> = ({ routes, loading, selectedRoute, setSelectedRoute }) => {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg w-full md:w-1/2 max-w-lg border dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recommended Routes</h2>

            {loading && <p className="text-gray-500 dark:text-gray-400 animate-pulse">Fetching routes...</p>}
            {!loading && routes.length === 0 && <p className="text-gray-500 dark:text-gray-400">No routes found. Try different filters.</p>}

            {!loading && routes.length > 0 && (
                <ul className="divide-y divide-gray-300 dark:divide-gray-700">
                    {routes.map((route) => (
                        <li
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`p-4 cursor-pointer rounded-lg transition-all duration-300 shadow-sm ${
                                selectedRoute?.id === route.id
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                            }`}
                        >
                            <b className="block">{route.name}</b>
                            <span className="text-sm opacity-80">📍 {route.start_latlng.join(", ")} → {route.end_latlng.join(", ")}</span>
                            <div className="text-xs opacity-70">
                                {route.distance / 1000} km | Elevation: {route.elev_difference}m | Avg Grade: {route.avg_grade}%
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RouteList;
