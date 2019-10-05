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
    RESET_STATES: 'RESET_STATES',
};

class GroupProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        req,
        query,
    }) {
        reduxStore.dispatch({
            type: actionTypes.RESET_STATES,
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
            redirectToDashboard,
        } = this.props;
        return (
            <Layout>
                {!redirectToDashboard
                    ? <GroupProfileWrapper {...this.props} />
                    : Router.push('/dashboard')}
            </Layout>
        );
    }
}

GroupProfile.defaultProps = {
    dispatch: func,
    isAUthenticated: false,
    redirectToDashboard: false,
    slug: '',
};

GroupProfile.propTypes = {
    dispatch: _.noop,
    isAUthenticated: bool,
    redirectToDashboard: bool,
    slug: string,
};

function mapStateToProps(state) {
    return {
        isAUthenticated: state.auth.isAuthenticated,
        redirectToDashboard: state.group.redirectToDashboard,
    };
}
export default connect(mapStateToProps)(GroupProfile);
