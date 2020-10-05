import React from 'react';
import {
    Container,
} from 'semantic-ui-react';

import Friend from '../components/Give/Friend';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Friends extends React.Component {
    static async getInitialProps({ query }) {
        return {
            campaignId: query.campaign_id,
            groupId: query.group_id,
            namespacesRequired: [
                'authHeader',
                'giveCommon',
                'friends',
                'accountTopUp',
                'review',
                'taxReceipt',
                'success',
                'error',
            ],
            step: query.step,
        };
    }

    render() {
        return (
            <Layout authRequired={true} >
                <div className="pageWraperGive">
                    <GiveWrapper {...this.props} baseUrl='/give/to/friend'>
                        <Friend />
                    </GiveWrapper>
                </div>
            </Layout>
        );
    }
}

export default Friends;
