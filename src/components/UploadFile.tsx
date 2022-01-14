import React, { useState } from 'react';
import { parseLocationHistory } from '../services/convertLocations';
import { Location, LocationView } from '../typings/common';
import { LocationsMap } from './Map';


export function FileUploadPage() {
    const [locations, setSelectedFile] = useState<LocationView[]>([]);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            const {result} = reader
            if (result) {
                const file = JSON.parse(result as string) as { locations: Location[] };
                console.log(file.locations.slice(0, 9));
    
                const newLocations = parseLocationHistory(file.locations).slice(10000, 20000);
                setSelectedFile(newLocations);
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
                    <LocationsMap coordinates={locations} />
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
        </div>
    );
}
