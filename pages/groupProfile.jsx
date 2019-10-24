import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    string,
    bool,
    func,
} from 'prop-types';

import {
    getGroupFromSlug,
} from '../actions/group';
import Layout from '../components/shared/Layout';
import GroupProfileWrapper from '../components/Group';
import { Router } from '../routes';
import storage from '../helpers/storage';

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
            slug: query.slug,
        };
    }

    componentDidMount() {
        const {
            dispatch,
            isAUthenticated,
            slug,
        } = this.props;
        (isAUthenticated
            && getGroupFromSlug(dispatch, slug)
        );
    }

    render() {
        const {
            groupDetails: {
                attributes: {
                    description,
                    location,
                    name,
                },
            },
            redirectToDashboard,
        } = this.props;
        let title = name;
        if (!_.isEmpty(location)) {
            title = `${name} | ${location}`;
        }
        const desc = (!_.isEmpty(description)) ? description : title;
        return (
            <Layout title={title} description={desc}>
                {!redirectToDashboard
                    ? <GroupProfileWrapper {...this.props} />
                    : Router.push('/search')}
            </Layout>
        );
    }
}

GroupProfile.defaultProps = {
    dispatch: func,
    groupDetails: {
        attributes: {
            description: '',
            location: '',
            name: '',
        },
    },
    isAUthenticated: false,
    redirectToDashboard: false,
    slug: '',
};

GroupProfile.propTypes = {
    dispatch: _.noop,
    groupDetails: {
        attributes: {
            description: string,
            location: string,
            name: string,
        },
    },
    isAUthenticated: bool,
    redirectToDashboard: bool,
    slug: string,
};

function mapStateToProps(state) {
    return {
        groupDetails: state.group.groupDetails,
        isAUthenticated: state.auth.isAuthenticated,
        redirectToDashboard: state.group.redirectToDashboard,
    };
}
export default connect(mapStateToProps)(GroupProfile);
