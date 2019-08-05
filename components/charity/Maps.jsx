import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
} from 'semantic-ui-react';
import {
    Map,
    GoogleApiWrapper,
} from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends React.Component {
    render() {
        return (
            <Grid width="30px">
            <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        />
        </Grid>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBB6dSc3n4M8We6X_-ZBV08m_bCp6cyksM',
})(Maps);
