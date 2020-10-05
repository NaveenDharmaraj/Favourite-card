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
            <Layout authRequired stripe>
                <Container>
                    <div className="pageWraper">
                        <GiveWrapper {...this.props} baseUrl="/give/to/friend">
                            <Friend />
                        </GiveWrapper>
                    </div>
                </Container>
            </Layout>
        );
    }
}

export default Friends;
