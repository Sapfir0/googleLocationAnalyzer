import { ApiInteractionService } from 'api_interaction_services';
import React, { useEffect, useState } from 'react';
import { LocationsMap } from './components/Map';

const api = new ApiInteractionService('http://localhost:8080');
function App() {
    const [data, setData] = useState([]);
    useEffect(async () => {
        const res = await api.get('/month', { month: 'october', year: 2021 });
        console.log(res);
        setData(res.right.timelineObjects);
    });

    return (
        <div className="App">
            <LocationsMap coordinates={data} />
            <header className="App-header">See it</header>
        </div>
    );
}

export default App;
