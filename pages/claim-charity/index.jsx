import React from 'react';
import ClaimCharityWrapper from '../../components/ClaimCharity/ClaimCharity';
import Layout from '../../components/shared/Layout';

function ClaimCharity() {
    return (
        <Layout authRequired={true}>
            <ClaimCharityWrapper></ClaimCharityWrapper>
        </Layout>
    )
}

export default ClaimCharity;
