import React, { cloneElement } from 'react';
import Layout from '../../components/shared/Layout';

import ToolTabs from '../../components/Give/Tools/ToolTabs';
// import charityLogo from '../static/images/canadian_red_cross.png';

function GivingGoals(props) {

        return (
            <Layout authRequired={true} >
                <div className="charityTab n-border">
                    <ToolTabs
                    defaultActiveIndex='2'
                    // onTabChangeFunc={this.onTabChangeFunc}
                    />

                </div>
            </Layout>
        );
}


export default GivingGoals;

