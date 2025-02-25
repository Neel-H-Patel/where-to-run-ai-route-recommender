'use client';

import { useState } from "react";

interface UserPreferencesFormProps {
    onSubmit: (preferences: { location: string; distance: number; safety: string; elevation: number; terrain: string }) => void;
}

const UserPreferencesForm: React.FC<UserPreferencesFormProps> = ({ onSubmit }) => {
    const [location, setLocation] = useState("");
    const [distance, setDistance] = useState(5.0);
    const [safety, setSafety] = useState("high");
    const [elevation, setElevation] = useState(50.0);
    const [terrain, setTerrain] = useState("road");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ location, distance, safety, elevation, terrain });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap w-full justify-center gap-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-md shadow">
            <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-3 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:text-gray-200"
            />
            <input
                type="number"
                placeholder="Distance (km)"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                className="p-3 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:text-gray-200"
            />
            <select value={safety} onChange={(e) => setSafety(e.target.value)} className="p-3 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:text-gray-200">
                <option value="low">Low Safety</option>
                <option value="medium">Medium Safety</option>
                <option value="high">High Safety</option>
            </select>
            <input
                type="number"
                placeholder="Elevation Gain (m)"
                value={elevation}
                onChange={(e) => setElevation(parseFloat(e.target.value) || 0)}
                className="p-3 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:text-gray-200"
            />
            <select value={terrain} onChange={(e) => setTerrain(e.target.value)} className="p-3 border rounded-md w-full md:w-auto dark:bg-gray-700 dark:text-gray-200">
                <option value="road">Road</option>
                <option value="trail">Trail</option>
                <option value="mixed">Mixed</option>
            </select>
            <button type="submit" className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">
                Find Routes
            </button>
        </form>
    );
};

export default UserPreferencesForm;
