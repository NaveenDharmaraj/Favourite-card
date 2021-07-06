import React, { useEffect } from 'react';
import {
    useDispatch, useSelector,
} from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

import { Router } from '../routes';
import Layout from '../components/shared/Layout';
import {
    createGivingGroupFlowSteps,
    getStore,
    intializeCreateGivingGroup,
} from '../helpers/createGrouputils';
import { updateCreateGivingGroupObj } from '../actions/createGivingGroup';
const CreateGivingGroupBasic = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupBasic'));
const CreateGivingGroupAbout = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupAbout'));
const CreateGivingGroupPicsVideo = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupPicsVideo'));
const CreateGivingGroupGivingGoal = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupGivingGoal'));

const GroupProfileCreate = (props) => {
    const {
        createGivingGroupStoreFlowObject,
        dispatch,
        slug,
        step,
        substep,
    } = props;
    useEffect(() => {
        const {
            slug,
            step,
            substep,
        } = props;
        const isFromCampaign = (!_isEmpty(step) && (step === 'step')) && (!_isEmpty(substep) && (substep === 'one'));
        if (slug !== 'one') {
            if ((window !== 'undefined' && _isEmpty(createGivingGroupStoreFlowObject)) && !isFromCampaign) {
                Router.pushRoute(createGivingGroupFlowSteps.stepOne);
            } else if ((window !== 'undefined' && _isEmpty(createGivingGroupStoreFlowObject)) && isFromCampaign) {
                const campaignDetails = useSelector((state) => state.profile.campaignDetails);
            } else if (!_isEmpty(createGivingGroupStoreFlowObject.attributes)) {
                if (_isEmpty(createGivingGroupStoreFlowObject.attributes.name)) {
                    Router.pushRoute(createGivingGroupFlowSteps.stepOne);
                } else if (_isEmpty(createGivingGroupStoreFlowObject.attributes.short) && slug !== 'two') {
                    Router.pushRoute(createGivingGroupFlowSteps.stepTwo)
                }
            }
        }
        // if (isFromCampaign) {
        //     dispatch({
        //         payload: {
        //             isFromCampaign: false,
        //         },
        //         type: 'SET_GROUP_FROM_CAMPAIGN',
        //     });
        //     if(!_isEmpty(campaignDetails)) {
        //         fromCampaignObj = {
        //             campaignId: campaignDetails.id,
        //             featuredCharities: campaignDetails.attributes.featuredCharities,
        //             isCampaignLocked: campaignDetails.attributes.isCampaignLocked,
        //             isFromCampaign: true,
        //         }
        //         dispatch({
        //             payload: {
        //                 fromCampaignObj,
        //             },
        //             type: 'SET_GROUP_FROM_CAMPAIGN_OBJECT',
        //         });
        //     }
        // } else {
        //     dispatch({
        //         payload: {
        //             fromCampaignObj,
        //         },
        //         type: 'SET_GROUP_FROM_CAMPAIGN_OBJECT',
        //     });
        // }
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
            step: query.step,
            substep: query.substep
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
    step: '',
    substep: ''
};

export default GroupProfileCreate;
