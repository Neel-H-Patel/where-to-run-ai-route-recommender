'use client';

import { Route } from "@/types";
import { Map, Marker } from "@vis.gl/react-google-maps";

const DEFAULT_CENTER = { lat: 40.73061, lng: -73.935242 }; // Default location (NYC)

interface RouteMapProps {
    selectedRoute: Route | null;
}

const RouteMap: React.FC<RouteMapProps> = ({ selectedRoute }) => {
    return (
        <Map defaultZoom={13} defaultCenter={DEFAULT_CENTER} className="w-full h-[500px] rounded-md shadow">
            {selectedRoute && (
                <>
                    <Marker position={{ lat: selectedRoute.start_latlng[0], lng: selectedRoute.start_latlng[1] }} title={selectedRoute.name} />
                    <Marker position={{ lat: selectedRoute.end_latlng[0], lng: selectedRoute.end_latlng[1] }} title={`${selectedRoute.name} (End)`} />
                </>
            )}
        </Map>
    );
};

export default RouteMap;
