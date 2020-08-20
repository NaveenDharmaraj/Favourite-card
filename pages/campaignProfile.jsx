
import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
} from 'prop-types';
import _ from 'lodash';
import getConfig from 'next/config';

import { Router } from '../routes';
import {
    getCampaignFromSlug,
    getCampaignSupportGroups,
} from '../actions/profile';
import Layout from '../components/shared/Layout';
import CampaignProfileWrapper from '../components/Campaign';
import storage from '../helpers/storage';
import '../static/less/campaign_profile.less';
import '../static/less/charityProfile.less';

class CampaignProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        req,
        query,
    }) {
        // reduxStore.dispatch({
        //     type: actionTypes.RESET_GROUP_STATES,
        // });
        let auth0AccessToken = null;
        if (typeof window === 'undefined') {
            auth0AccessToken = storage.get('auth0AccessToken', 'cookie', req.headers.cookie);
        }

        await getCampaignFromSlug(reduxStore.dispatch, query.slug, auth0AccessToken);
        return {
            slug: query.slug,
            namespacesRequired: [
                'common',
                'campaignProfile',
            ],
        };
    }

    componentDidMount() {
        const {
            dispatch,
            slugApiErrorStats,
            campaignDetails: {
                id,
            },
        } = this.props;
        if (slugApiErrorStats) {
            Router.pushRoute('/dashboard');
        } else {
            dispatch(getCampaignSupportGroups(id));
        }
    }

    render() {
        const { publicRuntimeConfig } = getConfig();

        const {
            APP_URL_ORIGIN,
        } = publicRuntimeConfig;

        const {
            campaignDetails: {
                attributes: {
                    about,
                    avatar,
                    causes,
                    name,
                    slug,
                },
            },
            slugApiErrorStats,
        } = this.props;
        const description = (!_.isEmpty(about)) ? about : name;
        const causesList = (causes.length > 0) ? _.map(causes, _.property('name')) : [];
        const keywords = (causesList.length > 0) ? _.join(_.slice(causesList, 0, 10), ', ') : '';
        const url = `${APP_URL_ORIGIN}/campaigns/${slug}`;
        if (!slugApiErrorStats) {
            return (
                <Layout
                    avatar={avatar}
                    keywords={keywords}
                    title={name}
                    description={description}
                    url={url}
                >
                    <CampaignProfileWrapper {...this.props} />
                </Layout>
            );
        }
        return null;
    }
}

CampaignProfile.defaultProps = {
    campaignDetails: {
        attributes: {
            about: '',
            avatar: '',
            causes: [],
            name: '',
            slug: '',
        },
    },
    slug: '',
};

CampaignProfile.propTypes = {
    campaignDetails: {
        attributes: {
            about: PropTypes.string,
            avatar: PropTypes.string,
            causes: PropTypes.array,
            name: PropTypes.string,
            slug: PropTypes.string,
        },
    },
    slug: PropTypes.string,
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
