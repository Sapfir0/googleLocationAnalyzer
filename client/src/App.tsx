import { ApiInteractionService } from 'api_interaction_services';
import { isLeft } from 'fp-ts/lib/Either';
import React, { useEffect, useState } from 'react';
import { ColoredPlaceVisit, LocationsMap } from './components/Map';
import LocationsParserWorker from './services/locationsParserWorker';
import { getColorList } from './services/utils';
import WorkerBuilder from './services/workerBuilder';

const api = new ApiInteractionService('http://localhost:8080');

export interface IAvailableDateDTO {
    availableDates: { month: string; year: string }[];
}

export interface IIntervalDTO {
    years: string[];
    timelineObjects: any[];
}

function App() {
    const [data, setData] = useState<ColoredPlaceVisit[]>([]);
    const instance = new WorkerBuilder(LocationsParserWorker);

    instance.onmessage = (message: MessageEvent<ColoredPlaceVisit[]>) => {
        if (message) {
            console.log('Message from worker', message.data);
            setData(message.data);
        }
    };

    useEffect(() => {
        async function fetchMyAPI() {
            const query = await api.get<IAvailableDateDTO>('/availableDate');
            if (isLeft(query)) {
                return;
            }

            const { availableDates } = query.right;

            const intervalQuery = await api.get<IIntervalDTO>('/interval', {
                startDate: `${availableDates[0].month}.${availableDates[0].year}`,
                endDate: `${availableDates[availableDates.length - 1].month}.${
                    availableDates[availableDates.length - 1].year
                }`,
            });

            if (isLeft(intervalQuery)) {
                return;
            }

            const colors = getColorList(intervalQuery.right.years.length);

            instance.postMessage({ colors, ...intervalQuery.right });
        }

        fetchMyAPI();
    }, []);

    return (
        <div className="App">
            <LocationsMap coordinates={data} />
        </div>
    );
}

export default App;
