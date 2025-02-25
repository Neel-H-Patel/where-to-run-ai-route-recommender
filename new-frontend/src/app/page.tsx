'use client';

import Image from "next/image";
import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import UserPreferencesForm from "@/components/UserPreferencesForm";
import RouteList from "@/components/RouteList";
import RouteMap from "@/components/RouteMap";
import { fetchRoutes } from "@/lib/api";
import { Route } from "@/types";

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);

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
  };

  return (
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={["geometry"]}>
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />
            <UserPreferencesForm onSubmit={handleRouteSearch} />
            <RouteList routes={routes} loading={loading} setSelectedRoute={setSelectedRoute} />
            <RouteMap selectedRoute={selectedRoute} />
          </main>
        </div>
      </APIProvider>
  );
}