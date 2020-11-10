import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _property from 'lodash/property';
import {
    array,
    string,
    bool,
    func,
    PropTypes,
} from 'prop-types';
import {
    Button,
    Responsive,
} from 'semantic-ui-react';
import getConfig from 'next/config';

import { withTranslation } from '../i18n';
import {
    getGroupFromSlug,
    getImageGallery,
    getMatchingHistory,
} from '../actions/group';
import Layout from '../components/shared/Layout';
import GroupProfileWrapper from '../components/Group';
import {
    Router,
    Link,
} from '../routes';
import storage from '../helpers/storage';
import {
    getGroupsAndCampaigns,
} from '../actions/user';
import {
    resetFlowObject,
} from '../actions/give';
import '../static/less/charityProfile.less';

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
        await reduxStore.dispatch(getGroupFromSlug(query.slug, auth0AccessToken));
        return {
            namespacesRequired: [
                'common',
                'groupProfile',
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
                id: groupId,
                relationships: {
                    galleryImages: {
                        links: {
                            related,
                        },
                    },
                },
            },
            redirectToPrivateGroupErrorPage,
            redirectToDashboard,
        } = this.props;
        if (!_isEmpty(groupId)) {
            dispatch(getMatchingHistory(groupId));
        }
        if (isCampaign) {
            Router.pushRoute(`/campaigns/${slug}`);
        }
        if (redirectToDashboard) {
            Router.push('/search');
        }
        if (redirectToPrivateGroupErrorPage) {
            Router.pushRoute('/group/error');
        }
        if (currentUser && currentUser.id) {
            getGroupsAndCampaigns(dispatch, `/users/${currentUser.id}/groupsWithOnlyMemberships?sort=-id`, 'groupsWithMemberships', false);
        }
        if (!_isEmpty(related)) {
            dispatch(getImageGallery(related));
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
            isAuthenticated,
            redirectToDashboard,
            t: formatMessage,
        } = this.props;
        let title = name;
        if (!_isEmpty(location)) {
            title = `${name} | ${location}`;
        }
        const desc = (!_isEmpty(description)) ? description : title;
        const causesList = (causes.length > 0) ? _map(causes, _property('name')) : [];
        const keywords = (causesList.length > 0) ? (causesList.slice(0, 10)).join(', ') : '';
        const url = `${APP_URL_ORIGIN}/groups/${slug}`;
        const giveButtonElement = <Button onClick={() => { resetFlowObject('group', dispatch); }} className="blue-btn-rounded-def">{formatMessage('common:giveButtonText')}</Button>;
        let giveButton = null;
        if (isAuthenticated) {
            giveButton = (
                <div className="buttonWraper">
                    <Link route={`/give/to/group/${slug}/new`}>
                        {giveButtonElement}
                    </Link>
                </div>
            );
        } else {
            giveButton = (
                <div className="buttonWraper">
                    <a href={(`${RAILS_APP_URL_ORIGIN}/send/to/group/${slug}`)}>
                        {giveButtonElement}
                    </a>
                </div>
            );
        }
        if (isCampaign !== true) {
            return (
                <div>
                    <Layout
                        avatar={avatar}
                        keywords={keywords}
                        title={title}
                        description={desc}
                        url={url}
                        isProfilePage
                    >
                        {!redirectToDashboard
                            && <GroupProfileWrapper {...this.props} />
                        }
                    </Layout>
                    <Responsive className="ch_MobGive" maxWidth={767} minWidth={320}>
                        {giveButton}
                    </Responsive>
                </div>
            );
        }
        return null;
    }
}

GroupProfile.defaultProps = {
    dispatch: () => {},
    groupDetails: {
        attributes: {
            avatar: '',
            causes: [],
            description: '',
            isCampaign: false,
            location: '',
            name: '',
            slug: '',
        },
        id: '',
        relationships: {
            galleryImages: {
                links: {
                    related: '',
                },
            },
        },
    },
    isAuthenticated: false,
    redirectToDashboard: false,
    redirectToPrivateGroupErrorPage: false,
    slug: '',
    t: () => {},
};

GroupProfile.propTypes = {
    dispatch: func,
    groupDetails: PropTypes.shape({
        attributes: PropTypes.shape({
            avatar: string,
            causes: array,
            description: string,
            isCampaign: bool,
            location: string,
            name: string,
            slug: string,
        }),
        id: string,
        relationships: PropTypes.shape({
            galleryImages: PropTypes.shape({
                links: PropTypes.shape({
                    related: string,
                }),
            }),
        }),
    }),
    isAuthenticated: bool,
    redirectToDashboard: bool,
    redirectToPrivateGroupErrorPage: bool,
    slug: string,
    t: func,
};

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        groupDetails: state.group.groupDetails,
        isAuthenticated: state.auth.isAuthenticated,
        redirectToDashboard: state.group.redirectToDashboard,
        redirectToPrivateGroupErrorPage: state.group.redirectToPrivateGroupErrorPage,
    };
}

const connectedComponent = withTranslation([
    'common',
    'groupProfile',
])(connect(mapStateToProps)(GroupProfile));
export {
    connectedComponent as default,
    GroupProfile,
    mapStateToProps,
};
