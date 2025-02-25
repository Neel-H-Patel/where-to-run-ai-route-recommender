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
        <Map defaultZoom={13} center={center} className="w-full rounded-md shadow">
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
    );
};

export default RouteMap;
