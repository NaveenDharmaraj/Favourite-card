import React, { cloneElement } from 'react';
import { validateUser } from '../actions/user';

import Friend from '../components/Give/Friend';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Friends extends React.Component {
    static async getInitialProps({ query }) {
        return {
            namespacesRequired: [
                'authHeader',
                'giveCommon',
                'friends',
                'accountTopUp',
            ],
            step: query.step,
        };
    }

    render() {
        return (
            <Layout authRequired={true}>
                <GiveWrapper {...this.props} baseUrl='/give/to/friend'>
                    <Friend />
                </GiveWrapper>
            </Layout>
        );
    }
}

export default Friends;
