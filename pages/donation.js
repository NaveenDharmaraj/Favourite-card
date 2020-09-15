import React from 'react';
import {
    Container,
} from 'semantic-ui-react';

import Donation from '../components/Give/Donation';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Donations extends React.Component {
    static async getInitialProps({ query }) {
        return {
            namespacesRequired: [
                'authHeader',
                'donation',
                'giveCommon',
                'review',
                'taxReceipt',
                'success',
                'error',
            ],
            recurringType: query['donation_details[recurring]'],
            step: query.step,
        };
    }

    render() {
        return (
            <Layout authRequired={true} >
                    <div className="pageWraperGive">
                        <GiveWrapper {...this.props} baseUrl='/donations'>
                            <Donation />
                        </GiveWrapper>
                    </div>
            </Layout>
        );
    }
}
export default Donations;
