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
                'giveCommon',
                'friends',
                'accountTopUp',
            ],
            step: query.step,
        };
    }

    render() {
        return (
            <Layout>
                Give to friend page !
                { this.props.step }
                <GiveWrapper {...this.props} baseUrl='/give/to/friend'>
                    <Friend />
                </GiveWrapper>
            </Layout>
        );
    }
}

export default Friends;
