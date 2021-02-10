import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../../../routes';
import Layout from '../../../components/shared/Layout';
import CreateGivingGroupGivingGoal from '../../../components/CreateGivingGroup/CreateGivingGroupGivingGoal';
import { CreateGivingGroupFlowSteps, getStore } from '../../../helpers/createGrouputils';

const CreateGivingGroupGivingGoalPage = (props) => {
    const {
        createGivingGroupStoreFlowObject
    } = props;
    useEffect(() => {
        if ((window !== 'undefined' && _isEmpty(createGivingGroupStoreFlowObject))) {
            Router.pushRoute(CreateGivingGroupFlowSteps.stepOne);
        } else if (!_isEmpty(createGivingGroupStoreFlowObject.attributes)) {
            if (_isEmpty(createGivingGroupStoreFlowObject.attributes.short)) {
                Router.pushRoute(CreateGivingGroupFlowSteps.stepTwo)
            } else if (_isEmpty(createGivingGroupStoreFlowObject.attributes.name)) {
                Router.pushRoute(CreateGivingGroupFlowSteps.stepOne);
            }
        }
    }, []);
    return (
        <Layout authRequired={true}>
            {!_isEmpty(createGivingGroupStoreFlowObject) &&
                <CreateGivingGroupGivingGoal {...props} />
            }
        </Layout>
    )
}
CreateGivingGroupGivingGoalPage.getInitialProps = async ({
    reduxStore,
}) => {
    try {
        const { createGivingGroupStoreFlowObject } = await getStore(reduxStore, 'createGivingGroup');
        return {
            createGivingGroupStoreFlowObject: createGivingGroupStoreFlowObject || {},
            dispatch: reduxStore.dispatch,
            namespacesRequired: [
                'common',
            ],
        }
    }
    catch (err) {
        // handle error
    }
    return {};
}
export default CreateGivingGroupGivingGoalPage;
