import React from 'react';
import { connect } from 'react-redux';
import {
    Map,
    GoogleApiWrapper,
    Marker,
} from 'google-maps-react';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyCtg_drc6h-eoCfnWhVANWbcqiO_p922BA");
const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends React.Component {
    static getGeoCoding() {
        return (
            Geocode.fromAddress("Eiffel Tower").then(
            response => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(lat, lng);
                <Marker position={{ lat: lat, lng: lng}} />
            },
            error => {
              console.error(error);
            }
          )
          );
    }
    render() {
        const {
            charityDetails,
        } = this.props;
        // Maps.getGeoCoding();
        return (
            <div style={{position:'relative',height:'500px'}}>
            <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 56.1304, lng: 106.3468}}
        >
            {/* {Maps.getGeoCoding()} */}
        <Marker position={{ lat: 56.1304, lng: 106.3468}} />
        <Marker position={{ lat: 37.0902, lng: 95.7129}} />
        </Map>
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
    };
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCtg_drc6h-eoCfnWhVANWbcqiO_p922BA',
})(connect(mapStateToProps)(Maps));
