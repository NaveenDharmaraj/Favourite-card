
import React from 'react';
import { connect } from 'react-redux';
import {
    PropTypes,
} from 'prop-types';
import _ from 'lodash';
import getConfig from 'next/config';
import { Responsive, Button } from 'semantic-ui-react';

import { withTranslation } from '../i18n';
import { Router, Link } from '../routes';
import {
    getCampaignFromSlug,
    getCampaignBeneficiariesCount,
    getCampaignSupportGroups,
    getCampaignGalleryImages,
} from '../actions/profile';
import { getMatchingHistory } from '../actions/group';
import Layout from '../components/shared/Layout';
import CampaignProfileWrapper from '../components/Campaign';
import storage from '../helpers/storage';
import {
    getGroupsAndCampaigns,
} from '../actions/user';
import {
    resetFlowObject,
} from '../actions/give';
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

        await reduxStore.dispatch(getCampaignFromSlug(query.slug, auth0AccessToken));
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
            currentUser:{
                id: userId,
            },
            currentUser,
            dispatch,
            slugApiErrorStats,
            campaignDetails: {
                attributes: {
                    groupId,
                },
                id,
            },
        } = this.props;
        if (slugApiErrorStats) {
            Router.pushRoute('/dashboard');
        } else {
            if (currentUser && userId) {
                getGroupsAndCampaigns(dispatch, `/users/${userId}/groupsWithOnlyMemberships?sort=-id`, 'groupsWithMemberships', false);
            }
            dispatch(getCampaignBeneficiariesCount(id));
            dispatch(getCampaignSupportGroups(id));
            dispatch(getCampaignGalleryImages(id));
            dispatch(getMatchingHistory(groupId));
        }
    }

    render() {
        const { publicRuntimeConfig } = getConfig();
        const {
            APP_URL_ORIGIN,
            RAILS_APP_URL_ORIGIN,
        } = publicRuntimeConfig;

        const {
            dispatch,
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
            isAuthenticated,
            t: formatMessage,
        } = this.props;
        const description = (!_.isEmpty(about)) ? about : name;
        const causesList = (causes.length > 0) ? _.map(causes, _.property('name')) : [];
        const keywords = (causesList.length > 0) ? _.join(_.slice(causesList, 0, 10), ', ') : '';
        const url = `${APP_URL_ORIGIN}/campaigns/${slug}`;
        const giveButton = <Button onClick={() => { resetFlowObject('group', dispatch); }} primary className="blue-btn-rounded-def">{formatMessage('campaignProfile:give')}</Button>;
        let buttonLink = null;
        if (isAuthenticated) {
            buttonLink = (
                <Link route={(`/give/to/group/${slug}/new`)}>
                    {giveButton}
                </Link>
            );
        } else {
            buttonLink = (
                <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                    {giveButton}
                </a>
            );
        }
        if (!slugApiErrorStats) {
            return (
                <div>
                    <Layout
                        avatar={avatar}
                        keywords={keywords}
                        title={name}
                        description={description}
                        url={url}
                        isProfilePage
                    >
                        <CampaignProfileWrapper {...this.props} />
                    </Layout>
                    <Responsive className="ch_MobGive" maxWidth={767} minWidth={320}>
                        {buttonLink}
                    </Responsive>
                </div>
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
    currentUser: {
        id: '',
    },
    dispatch: () => {},
    isAuthenticated: false,
    slug: '',
    slugApiErrorStats: false,
};

CampaignProfile.propTypes = {
    campaignDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            about: PropTypes.string,
            avatar: PropTypes.string,
            causes: PropTypes.array,
            name: PropTypes.string,
            slug: PropTypes.string,
        }),
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.string,
    }),
    dispatch: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    slug: PropTypes.string,
    slugApiErrorStats: PropTypes.bool,
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
        groupMatchingHistory: state.group.groupMatchingHistory,
        isAuthenticated: state.auth.isAuthenticated,
        seeMoreLoaderStatus: state.profile.seeMoreLoaderStatus,
        slugApiErrorStats: state.profile.slugApiErrorStats,
        subgroupCount: state.profile.subgroupCount,
        subGroupListLoader: state.profile.subGroupListLoader,
    };
}

export default withTranslation('campaignProfile')(connect(mapStateToProps)(CampaignProfile));
