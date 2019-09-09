import React from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import {
    Map,
    GoogleApiWrapper,
    Marker,
} from 'google-maps-react';
import Geocode from 'react-geocode';
import _isEmpty from 'lodash/isEmpty';
import {
    PropTypes,
    string,
} from 'prop-types';

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
    static async getGeoCoding(name) {
        const values = {};
        await Geocode.fromAddress(name).then(
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
            charityDetails: {
                charityDetails: {
                    attributes: {
                        countries,
                        headQuarterAddress,
                    },
                },
            },
            google,
        } = this.props;
        let centerLocation = {
            lat: null,
            lng: null,
        };
        if (headQuarterAddress) {
            centerLocation = Maps.getGeoCoding(headQuarterAddress);
        }
        return (
            <div style={{
                position: 'relative',
                height: '500px',
            }}
            >
                <Map
                    google={google}
                    zoom={2}
                    style={mapStyles}
                    initialCenter={centerLocation}
                >
                    {headQuarterAddress
                    && <Marker position={centerLocation} />}

                    {!_isEmpty(countries) && countries.map((country) => {
                        const markerLocation = Maps.getGeoCoding(country.name);
                        return (
                            <Marker position={markerLocation} />
                        );
                    })}
                </Map>
            </div>
        );
    }
}

Maps.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                countries: [],
                headQuarterAddress: null,
            },
        },
    },
};

Maps.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: PropTypes.shape({
                countries: PropTypes.arrayOf(),
                headQuarterAddress: string,
            }),
        },
    },
};


function mapStateToProps(state) {
    return {
        charityDetails: state.give.charityDetails,
    };
}

export default GoogleApiWrapper({
    apiKey: `${GOOGLE_MAP_API_KEY}`,
})(connect(mapStateToProps)(Maps));
