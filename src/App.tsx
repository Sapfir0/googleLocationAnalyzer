import GoogleMapReact from 'google-map-react';
import React from 'react';
import data from './data.json';
const AnyReactComponent = ({ text }: { text: string }) => <div>{text}</div>;

class SimpleMap extends React.Component<any, any> {
    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33,
        },
        zoom: 11,
    };

    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact defaultCenter={this.props.center} defaultZoom={this.props.zoom}>
                    <AnyReactComponent text="My Marker" />
                </GoogleMapReact>
            </div>
        );
    }
}

type Activity = {
    "timestampMs" : "1387457280733",
    "activity" : [{
        "type" : string,
        "confidence" : number
    }
 ]
        
}

type Location = {
    "timestampMs" : string,
    "latitudeE7" : number,
    "longitudeE7" : number,
    "accuracy" : number
    activity?: Activity
}

const parseLocationHistory = (locations: Location[]) => {
    return locations.map(loc => {
        return {
            activity: loc?.activity[0].activity[0].type,
            accuracy
        }
    })
}

function App() {
    console.log(data);
    return (
        <div className="App">
            <header className="App-header">See it</header>
            <SimpleMap />
        </div>
    );
}

export default App;
