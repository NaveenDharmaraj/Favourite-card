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
        return (
            <Layout>
                <GroupProfileWrapper {...this.props} />
            </Layout>
        );
    }
}

GroupProfile.defaultProps = {
    dispatch: func,
    isAUthenticated: false,
    slug: '',
};

GroupProfile.propTypes = {
    dispatch: _.noop,
    isAUthenticated: bool,
    slug: string,
};

function mapStateToProps(state) {
    return {
        isAUthenticated: state.auth.isAuthenticated,
    };
}
export default connect(mapStateToProps)(GroupProfile);
