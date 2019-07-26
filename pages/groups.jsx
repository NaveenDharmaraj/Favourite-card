import React from 'react';

import Group from '../components/Give/Group';
import GiveWrapper from '../components/Give';
import Layout from '../components/shared/Layout';

const firstStep = 'gift/new';

const flowSteps = [
    firstStep,
    'tax-receipt-profile',
    'review',
    'success',
    'error',
];

class Groups extends React.Component {
    static async getInitialProps({ query }) {
        return {
            namespacesRequired: [
                'group',
                'noteTo',
                'accountTopUp',
                'privacyOptions',
            ],
            slug: query.slug,
            sourceAccountHolderId: query.source_account_holder_id,
            step: (query.gift) ? `${query.slug}/${query.gift}/${query.step}` : query.step,
        };
    }

    render() {
        const {
            slug,
        } = this.props;
        // const baseUrl = (slug) ? `/give/to/group/${slug}` : '/give/to/group';
        if (slug) {
            flowSteps[0] = `${slug}/${firstStep}`;
        }
        return (
            <Layout authRequired={true}>
                <GiveWrapper {...this.props} baseUrl="/give/to/group" flowSteps={(slug) ? flowSteps : null}>
                    <Group />
                </GiveWrapper>
            </Layout>
        );
    }
}

export default Groups;
