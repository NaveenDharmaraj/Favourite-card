import React, { cloneElement } from 'react';

import { validateUser } from '../actions/user';
import Group from '../components/Give/Group';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

const flowSteps = [
    'gift/new',
    'tax-receipt',
    'review',
    'success',
    'error',
];

class Groups extends React.Component {
    static async getInitialProps({ query }) {
        console.log(query);
        return {
            slug: query.slug,
            step: (query.gift) ? `${query.gift}/${query.step}` : query.step,
        };
    }

    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        validateUser(dispatch);
    }

    render() {
        const {
            slug,
            step,
        } = this.props;
        const baseUrl = (slug) ? `/give/to/group/${slug}` : '/give/to/group';
        return (
            <Layout>
                Group page ! {step}
                <GiveWrapper {...this.props} baseUrl={baseUrl} flowSteps={(slug) ? flowSteps : null}>
                    <Group />
                </GiveWrapper>
            </Layout>
        );
    }
}

export default Groups;
