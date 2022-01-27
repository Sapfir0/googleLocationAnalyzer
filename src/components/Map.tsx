import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import { LocationView } from 'typings/common';
import './Map.css';

export interface ILocationMapProps {
    coordinates: LocationView[];
}

export function LocationsMap(props: ILocationMapProps) {
    return (
        <MapContainer preferCanvas={true} center={[59, 30]} zoom={7} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {props.coordinates.map((placeVisit, i) => {
                return (
                    <Circle
                        key={`${placeVisit.centerLngE7}-${placeVisit.centerLatE7}-${i}`}
                        center={{ lat: placeVisit.centerLatE7, lng: placeVisit.centerLngE7 }}
                        // pathOptions={{ color: area.color }}
                        radius={5}
                    />
                );
            })}
        </MapContainer>
    );
}
