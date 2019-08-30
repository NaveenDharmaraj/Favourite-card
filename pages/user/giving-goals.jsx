import React from 'react';
import {
    Container,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import ToolTabs from '../../components/Give/Tools/ToolTabs';
// import charityLogo from '../static/images/canadian_red_cross.png';

function GivingGoals(props) {

    return (
        <Layout authRequired={true} >
            <Container>
                <div className="charityTab n-border">
                    <ToolTabs
                        defaultActiveIndex="2"
                    // onTabChangeFunc={this.onTabChangeFunc}
                    />

                </div>
            </Container>
        </Layout>
    );
}


export default GivingGoals;
