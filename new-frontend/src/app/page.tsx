'use client';

import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Route } from "@/types";
import UserPreferencesForm from "@/components/UserPreferencesForm";
import RouteList from "@/components/RouteList";
import RouteMap from "@/components/RouteMap";

const DEFAULT_CENTER = { lat: 40.73061, lng: -73.935242 }; // Default location (NYC)

interface RoutePreferences {
    location: string;
    distance: number;
    safety: string;
    elevation: number;
    terrain: string;
}

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

const handleRouteSearch = async (preferences: RoutePreferences) => {
    try {
        setLoading(true);
        console.log("Fetching routes with preference:", preferences);

        const response = await fetch(`/api/get-ranked-routes?location=${preferences.location}&distance=${preferences.distance}&safety=${preferences.safety}&elevation=${preferences.elevation}&terrain=${preferences.terrain}`, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`Failed to fetch routes: ${response.statusText}`);
        }

        const fetchedRoutes: Route[] = await response.json();
        console.log("Fetched routes:", fetchedRoutes);

        setRoutes(fetchedRoutes);

        if (fetchedRoutes && fetchedRoutes.length > 0) {
            // **ADD THIS CHECK:** Ensure start_latlng exists before accessing it
            if (fetchedRoutes[0].start_latlng) {
                setMapCenter({
                    lat: fetchedRoutes[0].start_latlng[0],
                    lng: fetchedRoutes[0].start_latlng[1],
                });
                setSelectedRoute(fetchedRoutes[0]);
            } else {
                console.warn("start_latlng is undefined for the first route.");
                // Handle the case where start_latlng is missing.  Maybe set a default map center
                setMapCenter({ lat: 0, lng: 0 }); // Default to 0, 0
                setSelectedRoute(null);
            }
        } else {
            console.warn("No routes found for the given preferences.");
            setMapCenter({ lat: 0, lng: 0 });
            setSelectedRoute(null);
        }
    } catch (error) {
        console.error("Error fetching routes:", error);
    } finally {
        setLoading(false);
    }
};


  return (
  <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" as string} libraries={["geometry"]}>
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <header className="w-full text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Find Your Best Route
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Plan your journey with ease and efficiency.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <UserPreferencesForm onSubmit={handleRouteSearch} />
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <RouteList
            routes={routes}
            loading={loading}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
          />
          <RouteMap selectedRoute={selectedRoute} center={mapCenter} />
        </div>
      </main>

    </div>
  </APIProvider>
  );
}