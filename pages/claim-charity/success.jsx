import React from 'react';
import ClaimCharitySuccess from '../../components/ClaimCharity/ClaimCharitySuccess';
import Layout from '../../components/shared/Layout';
import { connect } from 'react-redux';
// import storage from '../../helpers/storage';

class ClaimSuccess extends React.Component {

    static async getInitialProps({ query }) {
        // const charityName = storage.get('charityName', 'local');
        return {
            activeRole: query.active_role_id,
            // charityName,
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
