import React, { cloneElement } from 'react';
import { validateUser } from '../actions/user';
import Charity from '../components/Give/Charity';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

const flowSteps = ['gift/new', 'tax-receipt-profile', 'review', 'success', 'error']

class Charities extends React.Component {
    static async getInitialProps({ query }) {
        return {
            groupId: query.group_id,
            namespacesRequired: [
                'charity',
                'giveCommon',
                'accountTopUp',
                'noteTo',
                'specialInstruction',
                'review',
                'taxReceipt',
                'error',
            ],
            slug: query.slug,
            sourceAccountHolderId: query.source_account_holder_id,
            step: (query.gift) ? `${query.gift}/${query.step}` : query.step,
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        validateUser(dispatch);
    }

    render() {
        const baseUrl = (this.props.slug) ? `/give/to/charity/${this.props.slug}` : '/give/to/charity'
        return (
            <Layout>
                Charity page ! {this.props.step}
                <GiveWrapper {...this.props} baseUrl={baseUrl} flowSteps={(this.props.slug) ? flowSteps : null}>
                    <Charity />
                </GiveWrapper> 
            </Layout>
        );
    }
    
}
  
export default Charities
