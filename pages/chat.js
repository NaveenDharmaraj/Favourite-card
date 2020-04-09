import React, { cloneElement } from 'react';
import ChatWrapper from '../components/Chats';
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Chats extends React.Component {
    static async getInitialProps({ query }) {
        return {
            msgId: query.msgId,
            namespacesRequired: [
                'notification',
                'common',
                'success',
                'error',
            ],
        };
    }

    render() {
        return (
            <Layout authRequired>
                {/* Move below to Wrapper before git commit */}
                <ChatWrapper {...this.props} baseUrl="/chats" />
            </Layout>
        );
    }
}
export default Chats;
