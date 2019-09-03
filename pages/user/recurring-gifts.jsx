import React from 'react';
import {
    Container,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import ToolTabs from '../../components/Give/Tools/ToolTabs';
// import charityLogo from '../static/images/canadian_red_cross.png';
function RecurringGifts(props) {
    return (
        <Layout authRequired={true} >
            <Container>
                <div className="charityTab n-border mt-3 mb-3">
                    <ToolTabs
                        defaultActiveIndex="1"
                        // onTabChangeFunc={this.onTabChangeFunc}
                    />

                </div>
            </Container>
        </Layout>
    );
}

export default RecurringGifts;
