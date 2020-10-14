import React from 'react';
import {
    Container,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { Router } from '../routes';
import Group from '../components/Give/Group';
import GiveWrapper from '../components/Give';
import Layout from '../components/shared/Layout';

const firstStep = 'new';

const flowSteps = [
    firstStep,
    'review',
    'success',
    'error',
];

class Groups extends React.Component {
    static async getInitialProps({ query }) {
        return {
            campaignId: query.campaign_id,
            groupCampaignId: query.groupCampaign_id,
            groupId: query.group_id,
            namespacesRequired: [
                'authHeader',
                'group',
                'noteTo',
                'accountTopUp',
                'privacyOptions',
            ],
            slug: query.slug,
            step: (query.slug) ? `${query.slug}/${query.step}` : query.step,
        };
    }

    async componentDidMount() {
        const {
            isAuthenticated,
            slug,
        } = this.props;
        if (!isAuthenticated && slug) {
            Router.pushRoute(`/send/to/group/${slug}`);
        }
    }

    render() {
        const {
            isAuthenticated,
            slug,
        } = this.props;
        // const baseUrl = (slug) ? `/give/to/group/${slug}` : '/give/to/group';
        if (slug) {
            flowSteps[0] = `${slug}/${firstStep}`;
        }
        return (
            <Layout authRequired stripe>
                <div className="pageWraperGive">
                    <GiveWrapper {...this.props} baseUrl="/give/to/group" flowSteps={(slug) ? flowSteps : null}>
                        <Group />
                    </GiveWrapper>
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
}

export default connect(mapStateToProps)(Groups);
