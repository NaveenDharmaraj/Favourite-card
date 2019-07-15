import React, { cloneElement } from 'react';
import { validateUser } from '../actions/user';

import Donation from '../components/Give/Donation';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Donations extends React.Component {
    static async getInitialProps({ query }) {
        return {
            namespacesRequired: [
                'donation',
                'giveCommon',
                'review',
                'taxReceipt',
            ],
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
                <GiveWrapper {...this.props} baseUrl='/donations'>
                    <Donation />
                </GiveWrapper> 
            </Layout>
        );
    }
}
export default Donations;
