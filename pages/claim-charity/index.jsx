import React from 'react';
import { connect } from 'react-redux';
import ClaimCharityWrapper from '../../components/ClaimCharity/ClaimCharity';
import Layout from '../../components/shared/Layout';

class ClaimCharity extends React.Component {
    render() {
        return (
            <div>
                <Layout authRequired>
                    <ClaimCharityWrapper {...this.props} />
                </Layout>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(ClaimCharity));
