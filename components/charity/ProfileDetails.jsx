import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
    string,
} from 'prop-types';
import {
    Tab, Container,
} from 'semantic-ui-react';

import {
    getBeneficiaryDoneeList,
} from '../../actions/charity';

import Chart from './Charts';
import Maps from './Maps';
import ReceivingOrganisations from './ReceivingOrganisations';

const ProfileDetails = (props) => {
    const {
        charityDetails,
    } = props;
    const panes = [
        {
            menuItem: 'About',
            render: () => (
                <Tab.Pane attached={false}>
                    <p>{charityDetails.charityDetails.attributes.description}</p>
                </Tab.Pane>
            ),
        },
        {
            menuItem: 'Revenue and expenses',
            render: () => <Tab.Pane attached={false}><Chart /></Tab.Pane>,
        },
        {
            menuItem: 'Worldwide locations',
            render: () => <Tab.Pane attached={false}><Maps /></Tab.Pane>,
        },
        {
            menuItem: 'Receiving organizations',
            render: () => <Tab.Pane className="no-border-bottom" attached={false}><ReceivingOrganisations /></Tab.Pane>,
        },
    ];
    return (
        <div className="pb-3">
            <Container>
                <div className="charityTab">
                    <Tab
                        menu={
                            {
                                pointing: true,
                                secondary: true,
                            }}
                        panes={panes}
                    />
                </div>
            </Container>
        </div>
    );
};

ProfileDetails.defaultProps = {
    charityDetails: {
        charityDetails: {
            attributes: {
                description: '',
            },
        },
    },
};

ProfileDetails.propTypes = {
    charityDetails: {
        charityDetails: {
            attributes: PropTypes.shape({
                description: string,
            }),
        },
    },
};

function mapStateToProps(state) {
    return {
        charityDetails: state.charity.charityDetails,
        donationDetails: state.charity.donationDetails,
    };
}

export default connect(mapStateToProps)(ProfileDetails);
