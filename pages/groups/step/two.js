import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';

import Layout from '../../../components/shared/Layout';
import CreateGivingGroupAbout from '../../../components/CreateGivingGroup/CreateGivingGroupAbout';
import { Router } from '../../../routes';
import { CreateGivingGroupFlowSteps, getStore } from '../../../helpers/createGrouputils';


const CreateGivingGroupAboutPage = (props) => {
    const {
        createGivingGroupStoreFlowObject
    } = props;
    useEffect(() => {
        if ((window !== 'undefined' && _isEmpty(createGivingGroupStoreFlowObject) ||
            (!_isEmpty(createGivingGroupStoreFlowObject) &&
                !_isEmpty(createGivingGroupStoreFlowObject.attributes) &&
                _isEmpty(createGivingGroupStoreFlowObject.attributes.name)))) {
            Router.pushRoute(CreateGivingGroupFlowSteps.stepOne)
        }
    }, []);
    return (
        <Layout authRequired={true}>
            {!_isEmpty(createGivingGroupStoreFlowObject)
                &&
                <CreateGivingGroupAbout {...props} />
            }
        </Layout>
    )
}
CreateGivingGroupAboutPage.getInitialProps = async ({
    reduxStore,
}) => {
    try {
        const { createGivingGroupStoreFlowObject } = await getStore(reduxStore, 'createGivingGroup');
        console.log('enteredd', createGivingGroupStoreFlowObject)
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

export default CreateGivingGroupAboutPage;
