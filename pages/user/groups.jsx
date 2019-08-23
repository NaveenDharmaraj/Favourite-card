
import Layout from '../../components/shared/Layout';
import GroupsAndCampaigns from '../../components/User/GroupsAndCampaigns';

function Groups() {
    return (
        <Layout authRequired>
            <GroupsAndCampaigns />
        </Layout>
    );
}

export default Groups;
