import React, { useEffect, useState } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Route } from "../types"; // Import Route interface
import { fetchRoutes } from "../api"; // Import API call function

const DEFAULT_CENTER = { lat: 40.73061, lng: -73.935242 }; // Default location (NYC)

const RouteMap: React.FC = () => {
    const [routes, setRoutes] = useState<Route[]>([]);

    useEffect(() => {
        // @ts-ignore
        const loadRoutes = async () => {
            const fetchedRoutes = await fetchRoutes("New York, NY", 5.0, "high", 50.0, "road");
            setRoutes(fetchedRoutes);
        };

        loadRoutes();
    }, []);

    return (
        <Map defaultZoom={13} defaultCenter={DEFAULT_CENTER} style={{ width: "100%", height: "500px" }}>
            {routes.map((route: Route) => (
                <React.Fragment key={route.id}>
                    {/* Start Marker */}
                    <Marker position={{ lat: route.start_latlng[0], lng: route.start_latlng[1] }} title={route.name} />

                    {/* End Marker */}
                    <Marker position={{ lat: route.end_latlng[0], lng: route.end_latlng[1] }} title={`${route.name} (End)`} />
                </React.Fragment>
            ))}
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
