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
                'success',
                'error',
            ],
            step: query.step,
        };
    }

    render() {
        return (
            <Layout authRequired={true} >
                <div className="pageWraper">
                    <GiveWrapper {...this.props} baseUrl='/donations'>
                        <Donation />
                    </GiveWrapper>
                </div>
            </Layout>
        );
    }
}
export default Donations;
