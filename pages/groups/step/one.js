import _isEmpty from 'lodash/isEmpty';

import Layout from '../../../components/shared/Layout';
import CreateGivingGroupBasic from '../../../components/CreateGivingGroup/CreateGivingGroupBasic';
import { getStore, intializeCreateGivingGroup } from '../../../helpers/createGrouputils';

const CreateGivingGroupBasicPage = ({ createGivingGroupStoreFlowObject }) => {
    return (
        <Layout authRequired={true}>
            <CreateGivingGroupBasic
                createGivingGroupStoreFlowObject={!_isEmpty(createGivingGroupStoreFlowObject) ? createGivingGroupStoreFlowObject : intializeCreateGivingGroup} />
        </Layout>
    )
}
CreateGivingGroupBasicPage.getInitialProps = async ({
    reduxStore,
}) => {
    try {
        const { createGivingGroupStoreFlowObject } = await getStore(reduxStore, 'createGivingGroup');
        return {
            createGivingGroupStoreFlowObject: createGivingGroupStoreFlowObject || {},
            namespacesRequired: [
                'common',
            ],
        }
    }
    catch (err) {
        // handle error
    }
    return {}
}
export default CreateGivingGroupBasicPage;
