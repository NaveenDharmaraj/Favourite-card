import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
    string,
} from 'prop-types';
import {
    Container,
    Grid,
} from 'semantic-ui-react';

import BreadcrumbDetails from '../shared/BreadCrumbs';

import CharityDetails from './CharityDetails';

const CharityProfileWrapper = (props) => {
    const {
        charityDetails: {
            attributes: {
                name,
            },
        },
    } = props;
    const pathArr = [
        'Explore',
        'Charities',
        name,
    ];
    return (
        <Container>
            <div className="top-breadcrumb">
                <BreadcrumbDetails
                    pathDetails={pathArr}
                />
            </div>
            <div className="ch_headerImage" />
            <Grid className="mb-2">
                <CharityDetails />
            </Grid>
        </Container>
    );
};


CharityProfileWrapper.defaultProps = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            name: '',
        }),
    }),
};

CharityProfileWrapper.propTypes = {
    charityDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            name: string,
        }),
    }),
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
    };
}

const connectedComponent = connect(mapStateToProps)(CharityProfileWrapper);
export {
    connectedComponent as default,
    CharityProfileWrapper,
    mapStateToProps,
};
