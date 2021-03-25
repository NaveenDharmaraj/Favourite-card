import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

import { Router } from '../routes';
import Layout from '../components/shared/Layout';
import { CreateGivingGroupFlowSteps, getStore, intializeCreateGivingGroup } from '../helpers/createGrouputils';
import { updateCreateGivingGroupObj } from '../actions/createGivingGroup';
const CreateGivingGroupBasic = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupBasic'));
const CreateGivingGroupAbout = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupAbout'));
const CreateGivingGroupPicsVideo = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupPicsVideo'));
const CreateGivingGroupGivingGoal = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupGivingGoal'));

const GroupProfileCreate = ({ createGivingGroupStoreFlowObject, dispatch, slug }) => {
    useEffect(() => {
        if (slug !== 'one') {
            if ((window !== 'undefined' && _isEmpty(createGivingGroupStoreFlowObject))) {
                Router.pushRoute(CreateGivingGroupFlowSteps.stepOne);
            } else if (!_isEmpty(createGivingGroupStoreFlowObject.attributes)) {
                if (_isEmpty(createGivingGroupStoreFlowObject.attributes.name)) {
                    Router.pushRoute(CreateGivingGroupFlowSteps.stepOne);
                } else if (_isEmpty(createGivingGroupStoreFlowObject.attributes.short) && slug !== 'two') {
                    Router.pushRoute(CreateGivingGroupFlowSteps.stepTwo)
                }
            }
        }
        return (() => {
            dispatch(updateCreateGivingGroupObj(intializeCreateGivingGroup));
        })
    }, []);
    const renderCreateGivingGroupCreate = () => {
        switch (slug) {
            case 'one':
                return <CreateGivingGroupBasic
                    createGivingGroupStoreFlowObject={!_isEmpty(createGivingGroupStoreFlowObject) ?
                        createGivingGroupStoreFlowObject : intializeCreateGivingGroup}
                    showBasic={true}
                    showButton={true}
                    fromCreate={true}
                    showMonthly={true}
                />
            case 'two':
                return <CreateGivingGroupAbout
                    createGivingGroupStoreFlowObject={!_isEmpty(createGivingGroupStoreFlowObject) ? createGivingGroupStoreFlowObject : intializeCreateGivingGroup}
                    fromCreate={true}
                />
            case 'three':
                return <CreateGivingGroupPicsVideo
                    createGivingGroupStoreFlowObject={!_isEmpty(createGivingGroupStoreFlowObject) ? createGivingGroupStoreFlowObject : intializeCreateGivingGroup}
                    fromCreate={true}
                />
            case 'four':
                return <CreateGivingGroupGivingGoal
                    createGivingGroupStoreFlowObject={!_isEmpty(createGivingGroupStoreFlowObject) ? createGivingGroupStoreFlowObject : intializeCreateGivingGroup}
                    fromCreate={true}
                    showCharity={true}
                    showGivingGoal={true}
                />
            default:
                break;
        }
    }
    return (
        <Layout authRequired={true}>
            {renderCreateGivingGroupCreate()}
        </Layout>
    )
}
GroupProfileCreate.getInitialProps = async ({
    query,
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
            slug: query.slug,
        }
    }
    catch (err) {
        // handle error
    }
    return {}
}
GroupProfileCreate.defaultProps = {
    createGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    dispatch: () => { },
    slug: '',
};
export default GroupProfileCreate;
