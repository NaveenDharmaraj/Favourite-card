import React from 'react';
import { connect } from 'react-redux';
import getConfig from 'next/config';
import GoogleMapReact from 'google-map-react';
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import {
    PropTypes,
    string,
    arrayOf,
    func,
    bool,
} from 'prop-types';
import {
    Icon,
    Loader,
} from 'semantic-ui-react';

import {
    getGeoCoding,
} from '../../actions/charity';

import CharityNoDataState from './CharityNoDataState';

const { publicRuntimeConfig } = getConfig();
const actionTypes = {
    CHARITY_LOADER_STATUS: 'CHARITY_LOADER_STATUS',
};

const {
    GOOGLE_MAP_API_KEY,
} = publicRuntimeConfig;

const MarkerComponent = () => (
    <div className="map-icon-1">
        <Icon.Group size="small">
            <Icon name="map marker alternate" />
        </Icon.Group>
    </div>
);

class Maps extends React.Component {
    componentDidMount() {
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
            headQuarterGeocode,
        } = this.props;
        const cityData = [];
        const headQuarterData = [];

        if ((!_isEmpty(headQuarterAddress) && _isEmpty(headQuarterGeocode))
        || (!_isEmpty(countries) && _isEmpty(countriesGeocode))) {
            dispatch({
                payload: {
                    mapLoader: true,
                },
                type: actionTypes.CHARITY_LOADER_STATUS,
            });
        }

        if (!_isEmpty(headQuarterAddress) && _isEmpty(headQuarterGeocode)) {
            headQuarterData.push(headQuarterAddress);
            getGeoCoding(dispatch, headQuarterData, true);
        }
        if (!_isEmpty(countries) && _isEmpty(countriesGeocode)) {
            countries.map((country) => {
                cityData.push(country.name);
            });
            getGeoCoding(dispatch, cityData, false);
        }
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
            countriesGeocode,
            dispatch,
            headQuarterGeocode,
            mapLoader,
        } = this.props;
        let centerLocation = {};
        let mapData = <CharityNoDataState />;

        if (!_isEmpty(headQuarterGeocode)) {
            centerLocation = headQuarterGeocode[0].attributes.lat_long;
        } else if (!_isEmpty(countriesGeocode)) {
            centerLocation = countriesGeocode[0].attributes.lat_long;
        }

        if (!_isEmpty(headQuarterGeocode) || !_isEmpty(countriesGeocode)) {
            mapData = (
                <GoogleMapReact
                    bootstrapURLKeys={{ key: `${GOOGLE_MAP_API_KEY}` }}
                    zoom={17}
                    center={centerLocation}
                >
                    {!_isEmpty(headQuarterGeocode)
                    && (
                        <MarkerComponent
                            lat={centerLocation.lat}
                            lng={centerLocation.lng}
                        />
                    )}
                    {!_isEmpty(countriesGeocode) && countriesGeocode.map((country) => (
                        <MarkerComponent
                            lat={country.attributes.lat_long.lat}
                            lng={country.attributes.lat_long.lng}
                        />
                    ))}
                </GoogleMapReact>
            );
        }
        return (
            <div style={{
                height: '500px',
                position: 'relative',
                width: '100%',
            }}
            >
                { !mapLoader
                    ? mapData
                    : (<Loader active size="large" />)}
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
    countriesGeocode: [],
    dispatch: func,
    headQuarterGeocode: [],
    mapLoader: false,
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
    mapLoader: bool,
};


function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        countriesGeocode: state.charity.countriesData,
        headQuarterGeocode: state.charity.headQuarterData,
        mapLoader: state.charity.mapLoader,
    };
}

export default connect(mapStateToProps)(Maps);
