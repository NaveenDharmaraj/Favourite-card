import React from 'react';
import ClaimCharitySuccess from '../../components/ClaimCharity/ClaimCharitySuccess';
import Layout from '../../components/shared/Layout';

class ClaimSuccess extends React.Component {

    static async getInitialProps({ query }) {
        return {
            activeRole: query.active_role_id
        };
    }

    render() {
        return (
            <Layout authRequired>
                <ClaimCharitySuccess {...this.props} />
            </Layout>
        )
    }
}

export default ClaimSuccess;
