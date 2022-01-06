import React, { useState } from 'react';
import { SimpleMap } from './Map';

type L1 = {
    timestampMs: string;
    activity: [
        {
            type: string;
            confidence: number;
        },
    ];
    source: string;
    deviceTag: number;
};

export type Location = {
    timestampMs: string;
    latitudeE7: number;
    longitudeE7: number;
    accuracy: number;
    activity?: L1[];
};


const getCoordinate = (coordinate: string) => {
    const s = coordinate.slice(0, 2);
    const rest = coordinate.slice(2);
    return Number.parseFloat(`${s}.${rest}`);
};

const parseLocationHistory = (locations: Location[]) => {
    return locations.map((loc) => {
        return {
            // activity: loc?.activity.length > 0 && loc?.activity[0].activity[0].type,
            // accuracy: loc.accuracy,
            lat: getCoordinate(loc.latitudeE7.toString()),
            lng: getCoordinate(loc.longitudeE7.toString()),
        };
    });
};

export function FileUploadPage() {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
        setIsFilePicked(true);

        var reader = new FileReader();
        reader.onload = function (e) {
            console.log(reader.result);

            const file = JSON.parse(reader.result);
            console.log(file);
            setSelectedFile(file);
        };
        reader.readAsText(event.target.files[0]);
    };
    console.log(selectedFile);

    return (
        <div>
            <input type="file" name="file" onChange={changeHandler} />
            {isFilePicked && selectedFile ? (
                <div>
                    <SimpleMap coordinates={parseLocationHistory(selectedFile.locations)} />
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
        </div>
    );
}
