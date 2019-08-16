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

class ProfileDetails extends React.Component {
    constructor(props) {
        super(props);
        this.onTabChangeFunc = this.onTabChangeFunc.bind(this);
    }

    onTabChangeFunc(event, data) {
        const {
            dispatch,
            charityDetails,
        } = this.props;
        if (data.panes[data.activeIndex].menuItem === 'Receiving organizations') {
            getBeneficiaryDoneeList(dispatch, charityDetails.charityDetails.id);
        }
    }

    render() {
        const {
            charityDetails,
        } = this.props;
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
                render: () => <Tab.Pane attached={false}><ReceivingOrganisations /></Tab.Pane>,
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
                            onTabChange={(event, data) => this.onTabChangeFunc(event, data)}
                        />
                    </div>
                </Container>
            </div>
        );
    }
}

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
        charityDetails: state.give.charityDetails,
        donationDetails: state.charity.donationDetails,
    };
}

export default connect(mapStateToProps)(ProfileDetails);
