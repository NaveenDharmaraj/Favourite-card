import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../../../routes';
import Layout from '../../../components/shared/Layout';
import CreateGivingGroupPicsVideo from '../../../components/CreateGivingGroup/CreateGivingGroupPicsVideo';
import { CreateGivingGroupFlowSteps, getStore } from '../../../helpers/createGrouputils';

const CreateGivingGroupPicsVideoPage = (props) => {
    const {
        createGivingGroupStoreFlowObject
    } = props;
    useEffect(() => {
        if ((window !== 'undefined' && _isEmpty(createGivingGroupStoreFlowObject))) {
            Router.pushRoute(CreateGivingGroupFlowSteps.stepOne);
        } else if (!_isEmpty(createGivingGroupStoreFlowObject)
            && !_isEmpty(createGivingGroupStoreFlowObject.attributes)) {
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
                <CreateGivingGroupPicsVideo {...props} />
            }
        </Layout>
    )
}

CreateGivingGroupPicsVideoPage.getInitialProps = async ({
    reduxStore,
}) => {
    try {
        const { createGivingGroupStoreFlowObject } = await getStore(reduxStore, 'createGivingGroup');
        return {
            namespacesRequired: [
                'common',
            ],
            createGivingGroupStoreFlowObject: createGivingGroupStoreFlowObject || {},
            dispatch: reduxStore.dispatch,
        }
    }
    catch (err) {
        // handle error
    }
    return {};
}
export default CreateGivingGroupPicsVideoPage;
