'use client';

import { Route } from "@/types";
import { Map, Marker } from "@vis.gl/react-google-maps";
import React from "react";

interface RouteMapProps {
    selectedRoute: Route | null;
    center: { lat: number; lng: number };
}

const RouteMap: React.FC<RouteMapProps> = ({ selectedRoute, center }) => {
    return (
        <div className="relative w-full md:w-1/2">
            <Map defaultZoom={13} center={center} className="w-full h-[500px] md:h-[600px] rounded-lg shadow-lg border dark:border-gray-700">
                {selectedRoute && (
                    <>
                        <Marker
                            key={`start-${selectedRoute.id}`}
                            position={{ lat: selectedRoute.start_latlng[0], lng: selectedRoute.start_latlng[1] }}
                            title={`${selectedRoute.name} - Start`}
                        />
                        <Marker
                            key={`end-${selectedRoute.id}`}
                            position={{ lat: selectedRoute.end_latlng[0], lng: selectedRoute.end_latlng[1] }}
                            title={`${selectedRoute.name} - End`}
                        />
                    </>
                )}
            </Map>
        </div>
    );
};

export default RouteMap;
