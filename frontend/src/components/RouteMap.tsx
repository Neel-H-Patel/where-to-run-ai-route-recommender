import React from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Route } from "../types";

const DEFAULT_CENTER = { lat: 40.73061, lng: -73.935242 }; // Default location (NYC)

interface RouteMapProps {
    selectedRoute: Route | null;
}

const RouteMap: React.FC<RouteMapProps> = ({ selectedRoute }) => {
    return (
        <Map defaultZoom={13} defaultCenter={DEFAULT_CENTER} style={{ width: "100%", height: "500px" }}>
            {selectedRoute && (
                <>
                    {/* Start Marker */}
                    <Marker position={{ lat: selectedRoute.start_latlng[0], lng: selectedRoute.start_latlng[1] }} title={selectedRoute.name} />

                    {/* End Marker */}
                    <Marker position={{ lat: selectedRoute.end_latlng[0], lng: selectedRoute.end_latlng[1] }} title={`${selectedRoute.name} (End)`} />
                </>
            )}
        </Map>
    );
};

// Function to decode the polyline into an array of lat/lng objects
const decodePolyline = (encoded: string): { lat: number; lng: number }[] => {
    const google = window.google;
    return google.maps.geometry.encoding.decodePath(encoded).map((point: google.maps.LatLng) => ({
        lat: point.lat(),
        lng: point.lng(),
    }));
};

export default RouteMap;
