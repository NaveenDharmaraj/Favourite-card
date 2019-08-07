import React, { cloneElement } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/shared/Layout';
import { Router } from '../../routes';

import ToolTabs from '../../components/Give/Tools/ToolTabs';
import { getUpcomingTransactions } from '../../actions/give';
// import charityLogo from '../static/images/canadian_red_cross.png';
function RecurringGifts(props){
    
    return (
        <Layout authRequired={true} >
            <div className="charityTab n-border">
                <ToolTabs
                defaultActiveIndex='1'
                // onTabChangeFunc={this.onTabChangeFunc}
                />

            </div>
        </Layout>
    );

}


export default RecurringGifts;

