import GoogleMapReact from 'google-map-react';
import React from 'react';


const Circle = () => (
    <div
        style={{
            background: 'grey',
            padding: '10px',
            display: 'inline-flex',
            borderRadius: '100%',
        }}
    ></div>
);

export interface IGMapProps {
    coordinates: L[]
}

export class GMap extends React.Component<IGMapProps, any> {
    render() {
        console.log(this.props.coordinates);

        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact defaultCenter={this.props.coordinates[0]} defaultZoom={11}>
                    {this.props.coordinates.map((area) => (
                        <Circle {...area} />
                    ))}
                </GoogleMapReact>
            </div>
        );
    }
}