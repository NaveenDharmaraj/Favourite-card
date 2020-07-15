import React from 'react';
import ClaimCharitySuccess from '../../components/ClaimCharity/Success';
import Layout from '../../components/shared/Layout';
import { connect } from 'react-redux';

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

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(ClaimSuccess));
