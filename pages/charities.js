import React from 'react';
import {
    Container,
} from 'semantic-ui-react';

import Charity from '../components/Give/Charity';
import GiveWrapper from '../components/Give';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

const firstStep = 'gift/new';

const flowSteps = [
    firstStep,
    'tax-receipt-profile',
    'review',
    'success',
    'error',
];

class Charities extends React.Component {
    static async getInitialProps({ query }) {
        return {
            groupId: query.group_id,
            namespacesRequired: [
                'authHeader',
                'charity',
                'giveCommon',
                'accountTopUp',
                'noteTo',
                'specialInstruction',
                'review',
                'taxReceipt',
                'success',
                'error',
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
        if (slug) {
            flowSteps[0] = `${slug}/${firstStep}`;
        }
        return (
            <Layout authRequired={true}>
                <Container>
                    <div className="pageWraper">
                        <GiveWrapper {...this.props} baseUrl="/give/to/charity" flowSteps={(slug) ? flowSteps : null}>
                            <Charity />
                        </GiveWrapper>
                    </div>
                </Container>
            </Layout>
        );
    }
}

export default Charities;
