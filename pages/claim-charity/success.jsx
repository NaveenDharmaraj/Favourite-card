import React from 'react';
import ClaimCharitySuccess from '../../components/ClaimCharity/Success';
import Layout from '../../components/shared/Layout';

class ClaimSuccess extends React.Component {

    static async getInitialProps({ query }) {
        return {
            slug: query.slug,
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
