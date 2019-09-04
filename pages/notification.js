import React, { cloneElement } from 'react';
import NotificationWrapper from "../components/Notification";
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Notifications extends React.Component {
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
        console.log("RENDERRERRER ");
        console.log(this);
        return (
            <Layout authRequired={true} >
                {/* Move below to Wrapper before git commit */}
                <h1>Notifications Title</h1>
                <NotificationWrapper {...this.props} baseUrl='/notifications'></NotificationWrapper>
            </Layout>
        );
    }
}
export default Notifications;
