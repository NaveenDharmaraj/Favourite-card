import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
    string,
} from 'prop-types';
import {
    Container,
    Grid,
    Divider,
    List,
    Header,
    Image,
} from 'semantic-ui-react';

import BreadcrumbDetails from '../shared/BreadCrumbs';
import TotalRevenue from '../../static/images/total_revenue.svg';
import ToalExpense from '../../static/images/total_expenses.svg';

import UserDetails from './UserDetails';
import CharityDetails from './CharityDetails';
import Charts from './Charts';
import CharityNoDataState from './CharityNoDataState';
import ProgramAreas from './ProgramAreas';
import ChartSummary from './ChartSummary';
import ProfileDetails from './ProfileDetails';

const CharityProfileWrapper = (props) => {
    const {
        charityDetails: {
            charityDetails: {
                attributes: {
                    name,
                },
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
            {/* BREADCRUMB */}
            <div className="ch_headerImage" />
            <Grid className="mb-2">
                <CharityDetails />
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={11} computer={11}>
                        <Grid>
                            <ProgramAreas />
                            <Divider />
                        </Grid>
                        <Charts />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};


CharityProfileWrapper.defaultProps = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            attributes: PropTypes.shape({
                name: '',
            }),
        }),
    }),
};

CharityProfileWrapper.propTypes = {
    charityDetails: PropTypes.shape({
        charityDetails: PropTypes.shape({
            attributes: PropTypes.shape({
                name: string,
            }),
        }),
    }),
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
    };
}

export default connect(mapStateToProps)(CharityProfileWrapper);
