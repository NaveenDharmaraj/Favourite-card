import React, { cloneElement } from 'react';
import ChatWrapper from "../components/Chat";
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Chats extends React.Component {
    static async getInitialProps({ query }) {
        console.log(query);
        return {
            namespacesRequired: [
                'notification',
                'common',
                'success',
                'error',
            ],
            msgId: query.msgId
        };
    }

    render() {
        return (
            <Layout authRequired={true} >
                {/* Move below to Wrapper before git commit */}
                <ChatWrapper {...this.props} baseUrl='/chats'></ChatWrapper>
            </Layout>
        );
    }
}
export default Chats;
