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

class GroupProfile extends React.Component {
    static async getInitialProps({
        reduxStore,
        query,
    }) {
        await getGroupFromSlug(reduxStore.dispatch, query.slug);
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
