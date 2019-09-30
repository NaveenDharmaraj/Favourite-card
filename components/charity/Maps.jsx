import React from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import {
    Map,
    GoogleApiWrapper,
    Marker,
} from 'google-maps-react';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    PropTypes,
    string,
    arrayOf,
    func,
} from 'prop-types';

import {
    getGeoCoding,
} from '../../actions/charity';

const { publicRuntimeConfig } = getConfig();

const {
    GOOGLE_MAP_API_KEY,
} = publicRuntimeConfig;

const mapStyles = {
    height: '100%',
    width: '100%',
};

const Maps = (props) => {
    const {
        charityDetails: {
            charityDetails: {
                attributes: {
                    countries,
                    headQuarterAddress,
                },
            },
        },
        countriesGeocode,
        dispatch,
        google,
        headQuarterGeocode,
    } = props;
    let centerLocation = {
        lat: null,
        lng: null,
    };
    const cityData = [];
    const headQuarterData = [];
    if (!_isEmpty(countries) && _isEmpty(countriesGeocode)) {
        countries.map((country) => {
            cityData.push(country.name);
        });
        getGeoCoding(dispatch, cityData, false);
    }
    if (headQuarterAddress && _isEmpty(headQuarterGeocode)) {
        headQuarterData.push(headQuarterAddress);
        getGeoCoding(dispatch, headQuarterData, true);
    }
    if (!_isEmpty(headQuarterGeocode)) {
        centerLocation = headQuarterGeocode[0].attributes.lat_long;
    }
    return (
        <div style={{
            height: '500px',
            position: 'relative',
        }}
        >
            <Map
                google={google}
                zoom={2}
                style={mapStyles}
                initialCenter={centerLocation}
            >
                {!_isEmpty(headQuarterGeocode)
                && <Marker position={centerLocation} />}

                {!_isEmpty(countriesGeocode) && countriesGeocode.map((country) => {
                    return (
                        <Marker position={country.attributes.lat_long} />
                    );
                })}
            </Map>
        </div>
    );
};

Maps.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                countries: [],
                headQuarterAddress: null,
            },
        },
    },
    countriesGeocode: [],
    dispatch: func,
    headQuarterGeocode: [],
};

Maps.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: PropTypes.shape({
                countries: arrayOf(PropTypes.element),
                headQuarterAddress: string,
            }),
        },
    },
    countriesGeocode: arrayOf(PropTypes.element),
    dispatch: _.noop,
    headQuarterGeocode: arrayOf(PropTypes.element),
};


function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        countriesGeocode: state.charity.countriesData,
        headQuarterGeocode: state.charity.headQuarterData,
    };
}

export default GoogleApiWrapper({
    apiKey: `${GOOGLE_MAP_API_KEY}`,
})(connect(mapStateToProps)(Maps));
