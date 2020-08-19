import React from 'react';

import ChatWrapper from '../components/Chats';
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
                <ChatWrapper {...this.props} />
            </Layout>
        );
    }
}
export default Chats;
