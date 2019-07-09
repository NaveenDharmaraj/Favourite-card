import React, { cloneElement } from 'react';
import { validateUser } from '../actions/user';

import Friend from '../components/Give/Friend';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Friends extends React.Component {
    static async getInitialProps({ query }) {
        return {
            step: query.step,
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        validateUser(dispatch);
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
