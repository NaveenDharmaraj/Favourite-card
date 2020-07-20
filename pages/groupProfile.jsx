import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    array,
    string,
    bool,
    func,
} from 'prop-types';
import getConfig from 'next/config';

import {
    getGroupFromSlug,
} from '../actions/group';
import Layout from '../components/shared/Layout';
import GroupProfileWrapper from '../components/Group';
import { Router } from '../routes';
import storage from '../helpers/storage';
import {
    getGroupsAndCampaigns,
} from '../actions/user';

const actionTypes = {
    RESET_GROUP_STATES: 'RESET_GROUP_STATES',
};

class GroupProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        req,
        query,
    }) {
        reduxStore.dispatch({
            type: actionTypes.RESET_GROUP_STATES,
        });
        let auth0AccessToken = null;
        if (typeof window === 'undefined') {
            auth0AccessToken = storage.get('auth0AccessToken', 'cookie', req.headers.cookie);
        }
        await getGroupFromSlug(reduxStore.dispatch, query.slug, auth0AccessToken);
        return {
            namespacesRequired: [
                'common',
            ],
            slug: query.slug,
        };
    }

    componentDidMount() {
        const {
            currentUser,
            dispatch,
            slug,
            groupDetails: {
                attributes: {
                    isCampaign,
                },
            },
            redirectToPrivateGroupErrorPage,
            redirectToDashboard,
        } = this.props;
        if (isCampaign === true) {
            Router.pushRoute(`/campaigns/${slug}`);
        }
        if (redirectToDashboard) {
            Router.push('/search');
        }
        if (redirectToPrivateGroupErrorPage) {
            Router.pushRoute('/group/error');
        }
        getGroupFromSlug(dispatch, slug);
        if (currentUser && currentUser.id) {
            getGroupsAndCampaigns(dispatch, `/users/${currentUser.id}/groupsWithOnlyMemberships?sort=-id`, 'groupsWithMemberships', false);
        }
    }

    render() {
        const { publicRuntimeConfig } = getConfig();

        const {
            APP_URL_ORIGIN,
        } = publicRuntimeConfig;

        const {
            groupDetails: {
                attributes: {
                    avatar,
                    causes,
                    description,
                    location,
                    name,
                    isCampaign,
                    slug,
                },
            },
            redirectToDashboard,
        } = this.props;
        let title = name;
        if (!_.isEmpty(location)) {
            title = `${name} | ${location}`;
        }
        const desc = (!_.isEmpty(description)) ? description : title;
        const causesList = (causes.length > 0) ? _.map(causes, _.property('name')) : [];
        const keywords = (causesList.length > 0) ? _.join(_.slice(causesList, 0, 10), ', ') : '';
        const url = `${APP_URL_ORIGIN}/groups/${slug}`;

        if (isCampaign !== true) {
            return (
                <Layout
                    avatar={avatar}
                    keywords={keywords}
                    title={title}
                    description={desc}
                    url={url}
                >
                    {!redirectToDashboard
                        && <GroupProfileWrapper {...this.props} />
                    }
                </Layout>
            );
        }
        return null;
    }
}

GroupProfile.defaultProps = {
    dispatch: func,
    groupDetails: {
        attributes: {
            avatar: '',
            causes: [],
            description: '',
            isCampaign: true,
            location: '',
            name: '',
            slug: '',
        },
    },
    isAUthenticated: false,
    redirectToDashboard: false,
    redirectToPrivateGroupErrorPage: false,
    slug: '',
};

GroupProfile.propTypes = {
    dispatch: _.noop,
    groupDetails: {
        attributes: {
            avatar: string,
            causes: array,
            description: string,
            isCampaign: bool,
            location: string,
            name: string,
            slug: string,
        },
    },
    isAUthenticated: bool,
    redirectToDashboard: bool,
    redirectToPrivateGroupErrorPage: bool,
    slug: string,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        groupDetails: state.group.groupDetails,
        isAUthenticated: state.auth.isAuthenticated,
        redirectToDashboard: state.group.redirectToDashboard,
        redirectToPrivateGroupErrorPage: state.group.redirectToPrivateGroupErrorPage,
    };
}
export default connect(mapStateToProps)(GroupProfile);
