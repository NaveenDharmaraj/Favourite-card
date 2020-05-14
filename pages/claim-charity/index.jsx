import React from 'react';
import ClaimCharityWrapper from '../../components/ClaimCharity/ClaimCharity';
import Layout from '../../components/shared/Layout';

class ClaimCharity extends React.Component {
    render() {
        return (
            <Layout authRequired={true}>
                <ClaimCharityWrapper></ClaimCharityWrapper>
            </Layout>
        )
    }
}

export default ClaimCharity;
