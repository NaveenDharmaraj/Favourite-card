import React, { cloneElement } from 'react';
import NotificationWrapper from "../components/Notification";
// import TaxReceipt from '../components/give/TaxReceipt'
import Layout from '../components/shared/Layout';

class Notifications extends React.Component {
    static async getInitialProps({ query }) {
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
                <NotificationWrapper {...this.props} baseUrl='/notifications'></NotificationWrapper>
            </Layout>
        );
    }
}
export default Notifications;
