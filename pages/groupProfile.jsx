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
} from 'prop-types';
import getConfig from 'next/config';

import {
    getGroupFromSlug,
    getImageGallery,
} from '../actions/group';
import Layout from '../components/shared/Layout';
import GroupProfileWrapper from '../components/Group';
import { Router } from '../routes';
import storage from '../helpers/storage';
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
            ],
            slug: query.slug,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            slug,
            groupDetails: {
                attributes: {
                    isCampaign,
                },
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
        if (isCampaign) {
            Router.pushRoute(`/campaigns/${slug}`);
        }
        if (redirectToDashboard) {
            Router.push('/search');
        }
        if (redirectToPrivateGroupErrorPage) {
            Router.pushRoute('/group/error');
        }
        if (!_isEmpty(related)) {
            dispatch(getImageGallery(related));
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
        if (!_isEmpty(location)) {
            title = `${name} | ${location}`;
        }
        const desc = (!_isEmpty(description)) ? description : title;
        const causesList = (causes.length > 0) ? _map(causes, _property('name')) : [];
        const keywords = (causesList.length > 0) ? (causesList.slice(0, 10)).join(', ') : '';
        const url = `${APP_URL_ORIGIN}/groups/${slug}`;
        if (isCampaign !== true) {
            return (
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
            isCampaign: true,
            location: '',
            name: '',
            slug: '',
        },
        relationships: {
            galleryImages: {
                links: {
                    related: '',
                },
            },
        },
    },
    isAUthenticated: false,
    redirectToDashboard: false,
    redirectToPrivateGroupErrorPage: false,
    slug: '',
};

GroupProfile.propTypes = {
    dispatch: func,
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
        relationships: {
            galleryImages: {
                links: {
                    related: string,
                },
            },
        },
    },
    isAUthenticated: bool,
    redirectToDashboard: bool,
    redirectToPrivateGroupErrorPage: bool,
    slug: string,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAUthenticated: state.auth.isAuthenticated,
        redirectToDashboard: state.group.redirectToDashboard,
        redirectToPrivateGroupErrorPage: state.group.redirectToPrivateGroupErrorPage,
    };
}
export default connect(mapStateToProps)(GroupProfile);
