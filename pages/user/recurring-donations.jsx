import React, { cloneElement } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/shared/Layout';

import ToolTabs from '../../components/Give/Tools/ToolTabs';
import { getUpcomingTransactions } from '../../actions/give';
// import charityLogo from '../static/images/canadian_red_cross.png';

function RecurringDonations(props) {
    return (
        <Layout authRequired={true} >
            <div className="charityTab n-border">
                <ToolTabs
                defaultActiveIndex='0'
                // onTabChangeFunc={this.onTabChangeFunc}
                />

            </div>
        </Layout>
    );
}


export default RecurringDonations;

