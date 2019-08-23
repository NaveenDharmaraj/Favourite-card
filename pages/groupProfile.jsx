import React from 'react';

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

    render() {
        return (
            <Layout>
                <GroupProfileWrapper {...this.props} />
            </Layout>
        );
    }
}
export default GroupProfile;
