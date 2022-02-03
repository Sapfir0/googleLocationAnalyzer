import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import { PlaceVisit } from 'typings/common';
import './Map.css';

export interface ColoredPlaceVisit extends PlaceVisit {
    color: string
}

export interface ILocationMapProps {
    coordinates: {
        timelineObjects: ColoredPlaceVisit[]
        years: string[]
        colors: string[]
    }

}

export function LocationsMap(props: ILocationMapProps) {
    return (
        <MapContainer preferCanvas={true} center={[59, 30]} zoom={7} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {props.coordinates.timelineObjects.map((placeVisit, i) => {
                return (
                    <Circle
                        key={`${placeVisit.centerLngE7}-${placeVisit.centerLatE7}-${i}`}
                        center={{ lat: placeVisit.centerLatE7, lng: placeVisit.centerLngE7 }}
                        pathOptions={{ color: placeVisit.color }}
                        radius={5}
                    />
                );
            })}
        </MapContainer>
    );
}
