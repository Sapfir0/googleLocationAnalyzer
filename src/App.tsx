import { ApiInteractionService } from 'api_interaction_services';
import React, { useEffect, useState } from 'react';
import { LocationsMap } from './components/Map';

const api = new ApiInteractionService('http://localhost:8080');

function App() {
    const [data, setData] = useState([]);
    useEffect(async () => {
        const { right } = await api.get('/availableDate');
        const { availableDates } = right;
        console.log(availableDates);

        const res = await api.get('/interval', {
            startDate: `${availableDates[0].month}.${availableDates[0].year}`,
            endDate: `${availableDates[availableDates.length - 1].month}.${
                availableDates[availableDates.length - 1].year
            }`,
        });

        const allLocations = res.right.timelineObjects;
        console.log(allLocations);

        setData(allLocations);
    }, []);

    return (
        <div className="App">
            <LocationsMap coordinates={data} />
            <header className="App-header">See it</header>
        </div>
    );
}

export default App;
