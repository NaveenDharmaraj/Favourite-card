import React from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import {
    Map,
    GoogleApiWrapper,
    Marker,
} from 'google-maps-react';
import Geocode from 'react-geocode';

const { publicRuntimeConfig } = getConfig();

const {
    GOOGLE_MAP_API_KEY,
} = publicRuntimeConfig;

Geocode.setApiKey(`${GOOGLE_MAP_API_KEY}`);
const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends React.Component {
    static getGeoCoding(name) {
        const values = {};
        Geocode.fromAddress(name).then(
            (response) => {
                const {
                    lat,
                    lng,
                } = response.results[0].geometry.location;
                // console.log(lat, lng);
                values.lat = lat;
                values.lng = lng;
                return values;
            },
            (error) => {
                console.error(error);
            },
        );
        return values;
    }

    render() {
        const {
            charityDetails,
        } = this.props;
        return (
            <div style={{
                position: 'relative',
                height: '500px',
            }}
            >
                <Map
                    google={this.props.google}
                    zoom={8}
                    style={mapStyles}
                    initialCenter={
                        Maps.getGeoCoding((charityDetails.charityDetails
                            && charityDetails.charityDetails.attributes)
                            && charityDetails.charityDetails.attributes.countries[0].name)
                    }
                >
                    {(charityDetails.charityDetails && charityDetails.charityDetails.attributes)
                    && charityDetails.charityDetails.attributes.countries.map((country) => {
                        const location = Maps.getGeoCoding(country.name);
                        return (
                            <Marker position={{
                                lat: location.lat,
                                lng: location.lng,
                            }}
                            />
                        );
                    })}
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
    apiKey: `${GOOGLE_MAP_API_KEY}`,
})(connect(mapStateToProps)(Maps));
