import React from 'react';
import ClaimCharityWrapper from '../../components/ClaimCharity/ClaimCharity';
import Layout from '../../components/shared/Layout';

class ClaimCharity extends React.Component {
    render() {
        return (
            <div>
                <Layout>
                    <ClaimCharityWrapper {...this.props} />
                </Layout>
            </div>
        )
    }
}


export default ClaimCharity;
