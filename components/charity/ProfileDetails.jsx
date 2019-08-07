import React from 'react';
import { connect } from 'react-redux';
import {
    Tab,
} from 'semantic-ui-react';
import {
    getBeneficiaryDoneeList
} from '../../actions/charity';
import Chart from '../charity/Charts';
import Maps from '../charity/Maps';
import ReceivingOrganisations from '../charity/ReceivingOrganisations';

class ProfileDetails extends React.Component {
    constructor(props) {
        super(props)
        this.onTabChangeFunc = this.onTabChangeFunc.bind(this);
    }
    onTabChangeFunc(event, data) {
        const {
            dispatch,
            charityId,
        } = this.props;
        if (data.panes[data.activeIndex].menuItem === 'Receiving organizations') {
            getBeneficiaryDoneeList(dispatch,charityId.charityDetails.id);
        }

    }
    render() {
        const {
            charityId,
        } = this.props;
        const panes = [
            { menuItem: 'About', render: () =>
                <Tab.Pane attached={false}>
                    <p>{((charityId && charityId.charityDetails && charityId.charityDetails.attributes) && charityId.charityDetails.attributes.description)}</p>
                </Tab.Pane> 
            },
            { menuItem: 'Revenue and expenses', render: () => <Tab.Pane attached={false}><Chart /></Tab.Pane> },
            { menuItem: 'Worldwide locations', render: () => <Tab.Pane attached={false}><Maps /></Tab.Pane> },
            { menuItem: 'Receiving organizations', render: () => <Tab.Pane attached={false}><ReceivingOrganisations /></Tab.Pane> },
          ];
        return (
            <div className="charityTab">
            <Tab menu={{ secondary: true, pointing: true }} panes={panes}
            onTabChange={(event, data) => this.onTabChangeFunc(event, data)}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        donationDetails: state.charity.donationDetails,
        charityId: state.give.charityDetails,
    };
}

export default connect(mapStateToProps)(ProfileDetails);
