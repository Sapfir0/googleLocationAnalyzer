import React, { useState } from 'react';
import LocationsParserWorker from '../services/locationsParserWorker';
import WorkerBuilder from '../services/workerBuilder';
import { LocationView } from '../typings/common';
import { LocationsMap } from './Map';

export function FileUploadPage() {
    const [locations, setSelectedFile] = useState<LocationView[]>([]);
    const instance = new WorkerBuilder(LocationsParserWorker);
    instance.onmessage = (message) => {
        if (message) {
            console.log('Message from worker', message.data);
            setSelectedFile(message.data);
        }
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const { result } = reader;

            if (result) {
                // const file = JSON.parse( as string) as { locations: Location[] };

                instance.postMessage(result);
            }
        };
        reader.readAsText(event.target.files[0]);
    };
    console.log(locations);

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler} />
            {locations.length ? (
                <div>
                   
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
        </div>
    );
}
