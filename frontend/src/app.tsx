import React from 'react';
import { createRoot } from "react-dom/client";
import {APIProvider} from '@vis.gl/react-google-maps';

const App = () => (
    <APIProvider apiKey={'Your API key here'} onLoad={() => console.log('Maps API has loaded.')}>
        <h1>Hello, world!</h1>
    </APIProvider>
);

const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;