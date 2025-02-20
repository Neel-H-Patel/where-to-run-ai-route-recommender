import React, { useState } from "react";

const UserPreferencesForm = ({ onSubmit }) => {
    const [location, setLocation] = useState("");
    const [distance, setDistance] = useState(5.0);
    const [safety, setSafety] = useState("high");
    const [elevation, setElevation] = useState(50.0);
    const [terrain, setTerrain] = useState("road");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ location, distance, safety, elevation, terrain });
    };

    return (
        <header style={styles.header}>
            <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Distance (km)"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                style={styles.input}
            />
            <select value={safety} onChange={(e) => setSafety(e.target.value)} style={styles.select}>
                <option value="low">Low Safety</option>
                <option value="medium">Medium Safety</option>
                <option value="high">High Safety</option>
            </select>
            <input
                type="number"
                placeholder="Elevation Gain (m)"
                value={elevation}
                onChange={(e) => setElevation(parseFloat(e.target.value) || 0)}
                style={styles.input}
            />
            <select value={terrain} onChange={(e) => setTerrain(e.target.value)} style={styles.select}>
                <option value="road">Road</option>
                <option value="trail">Trail</option>
                <option value="mixed">Mixed</option>
            </select>
            <button onClick={handleSubmit} style={styles.button}>Find Routes</button>
        </header>
    );
};

// Styles for simplicity
const styles = {
    header: { display: "flex", gap: "10px", padding: "10px", background: "#f5f5f5" },
    input: { padding: "8px", width: "200px" },
    select: { padding: "8px" },
    button: { padding: "8px 12px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" },
    container: { display: "flex", marginTop: "10px" },
    sidebar: { width: "200px", padding: "10px", background: "#eee" },
    mainContent: { flexGrow: 1, padding: "10px" }
};

export default UserPreferencesForm;