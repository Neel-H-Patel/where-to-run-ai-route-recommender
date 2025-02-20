import React, {useState} from 'react';
import { createRoot } from "react-dom/client";
import {APIProvider} from '@vis.gl/react-google-maps';
import RouteList from "./components/RouteList";
import RouteMap from "./components/RouteMap";
import {fetchRoutes} from "./api";
import UserPreferencesForm from "./components/UserPreferencesForm";

const App = () => {
    const [routes, setRoutes] = useState([]); // Shared state for routes
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const handleRouteSearch = async (preferences) => {
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
        <APIProvider apiKey="API key goes here" libraries={["geometry"]}>
            <h1>AI Route Recommender</h1>
            <UserPreferencesForm onSubmit={handleRouteSearch} />
            <div style={styles.container}>
                <aside style={styles.sidebar}>[Future Filters]</aside>
                <main style={styles.mainContent}>
                    <RouteList routes={routes} loading={loading} />
                    <RouteMap routes={routes} />
                </main>
            </div>
        </APIProvider>
    );
};

// Styles
const styles = {
    container: { display: "flex", marginTop: "10px" },
    sidebar: { width: "200px", padding: "10px", background: "#eee" },
    mainContent: { flexGrow: 1, padding: "10px" }
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;