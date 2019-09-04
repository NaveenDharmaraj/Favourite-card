import React from 'react';
import { connect } from 'react-redux';
import {
    func,
    PropTypes,
    string,
} from 'prop-types';

import { Router } from '../routes';
import {
    getCampaignFromSlug,
} from '../actions/profile';
import Layout from '../components/shared/Layout';
import CampaignProfileWrapper from '../components/Campaign';

class CampaignProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        query,
    }) {
        await getCampaignFromSlug(reduxStore.dispatch, query.slug);
        return {
            slug: query.slug,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            slug,
            slugApiErrorStats,
        } = this.props;
        if (slugApiErrorStats) {
            Router.pushRoute('/dashboard');
        } else {
            getCampaignFromSlug(dispatch, slug);
        }
    }

    render() {
        const {
            slugApiErrorStats,
        } = this.props;

        if (!slugApiErrorStats) {
            return (
                <Layout>
                    <CampaignProfileWrapper {...this.props} />
                </Layout>
            );
        }
        return null;
    }
}

CampaignProfile.defaultProps = {
    slug: '',
};

CampaignProfile.propTypes = {
    slug: string,
};

function mapStateToProps(state) {
    return {
        campaignDetails: state.profile.campaignDetails,
        campaignImageGallery: state.profile.campaignImageGallery,
        campaignSubGroupDetails: state.profile.campaignSubGroupDetails,
        campaignSubGroupsShowMoreUrl: state.profile.campaignSubGroupsShowMoreUrl,
        currentUser: state.user.info,
        deepLinkUrl: state.profile.deepLinkUrl,
        disableFollow: state.profile.disableFollow,
        isAuthenticated: state.auth.isAuthenticated,
        seeMoreLoaderStatus: state.profile.seeMoreLoaderStatus,
        slugApiErrorStats: state.profile.slugApiErrorStats,
        subGroupListLoader: state.profile.subGroupListLoader,
    };
}

export default connect(mapStateToProps)(CampaignProfile);
