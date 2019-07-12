import React, { cloneElement } from 'react';
import { validateUser } from '../actions/user';

import Group from '../components/Give/Group';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

const flowSteps = ['gift/new', 'tax-receipt', 'review', 'success', 'error']

class Groups extends React.Component {
    static async getInitialProps({ query }) {
        console.log(query);
        return {
            namespacesRequired: [
                'group',
                'noteTo',
                'accountTopUp',
                'privacyOptions',
            ],
            slug: query.slug,
            step: (query.gift) ? `${query.gift}/${query.step}` : query.step,
        };
    }

    componentDidMount() {
        const {dispatch} = this.props
        validateUser(dispatch);
    }

    render() {
        const baseUrl = (this.props.slug) ? `/give/to/group/${this.props.slug}` : '/give/to/group'
        return (
            <Layout>
                Group page ! {this.props.step}
                <GiveWrapper {...this.props} baseUrl={baseUrl} flowSteps={(this.props.slug) ? flowSteps : null}>
                    <Group />
                </GiveWrapper> 
            </Layout>
        );
    }
    
}
  
export default Groups
