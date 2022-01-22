import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import { LocationView } from 'typings/common';
import './Map.css';

export interface ILocationMapProps {
    coordinates: LocationView[];
}

export function LocationsMap(props: ILocationMapProps) {
    console.log(props.coordinates);

    return (
        <MapContainer preferCanvas={true} center={[48, 44]} zoom={7} scrollWheelZoom={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.coordinates.map((area, i) => (
                <Circle
                    key={`${area.lat}-${area.lng}-${i}`}
                    center={area}
                    pathOptions={{ color: area.color }}
                    radius={3}
                />
            ))}
        </MapContainer>
    );
}
