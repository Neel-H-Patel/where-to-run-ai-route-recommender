'use client';

import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Route } from "@/types";
import UserPreferencesForm from "@/components/UserPreferencesForm";
import RouteList from "@/components/RouteList";
import RouteMap from "@/components/RouteMap";
import { fetchRoutes } from "@/lib/api";

const DEFAULT_CENTER = { lat: 40.73061, lng: -73.935242 }; // Default location (NYC)

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  const handleRouteSearch = async (preferences: any) => {
    setLoading(true);
    console.log("Fetching routes with preferences:", preferences);

    const fetchedRoutes = await fetchRoutes(
        preferences.location,
        preferences.distance,
        preferences.safety,
        preferences.elevation,
        preferences.terrain
    );

    setRoutes(fetchedRoutes);
    setLoading(false);

    if (fetchedRoutes.length > 0) {
      setMapCenter({
        lat: fetchedRoutes[0].start_latlng[0],
        lng: fetchedRoutes[0].start_latlng[1],
      });
    }
  };

  return (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={["geometry"]}>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
            <UserPreferencesForm onSubmit={handleRouteSearch} />
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <RouteList routes={routes} loading={loading} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
              <RouteMap selectedRoute={selectedRoute} center={mapCenter} />
            </div>
          </main>
        </div>
      </APIProvider>
  );
}