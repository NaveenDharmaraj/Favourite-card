/* eslint-disable no-else-return */
import _ from 'lodash';

import { Router } from '../routes';
import coreApi from '../services/coreApi';
import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';

const generatePayloadBodyForFollowAndUnfollow = (userId, id, type) => {

    let filterObj = {};
    switch (type) {
        case 'beneficiaries':
            filterObj = {
                entity: 'charity',
                filters: {
                    charity_id: Number(id),
                },
            };
            break;
        case 'campaigns':
        case 'groups':
            filterObj = {
                entity: 'group',
                filters: {
                    group_id: Number(id),
                },
            };
            break;
        
        default:
            break;
    }
    const payloadObj = {
        relationship: 'FOLLOWS',
        source: {
            entity: 'user',
            filters: {
                user_id: Number(userId),
            },
        },
        target: filterObj,
    };
    return payloadObj;
};

export const actionTypes = {
    DEEP_LINK_URL: 'DEEP_LINK_URL',
    DISABLE_FOLLOW_BUTTON: 'DISABLE_FOLLOW_BUTTON',
    GET_CAMPAIGN_FROM_SLUG: 'GET_CAMPAIGN_FROM_SLUG',
    GET_IMAGES_FOR_CAMPAIGN: 'GET_IMAGES_FOR_CAMPAIGN',
    GET_SUB_GROUPS_FOR_CAMPAIGN: 'GET_SUB_GROUPS_FOR_CAMPAIGN',
    SAVE_FOLLOW_STATUS_CAMPAIGN: 'SAVE_FOLLOW_STATUS_CAMPAIGN',
    SAVE_FOLLOW_STATUS_CHARITY: 'SAVE_FOLLOW_STATUS_CHARITY',
    SAVE_FOLLOW_STATUS_GROUP: 'SAVE_FOLLOW_STATUS_GROUP',
    SEE_MORE_LOADER: 'SEE_MORE_LOADER',
    SUB_GROUP_LIST_LOADER: 'SUB_GROUP_LIST_LOADER',
};

export const getCampaignFromSlug = async (dispatch, slug) => {
    // return coreApi.get(`campaign/find_by_slug`, {
    await coreApi.get(`campaigns/find_by_slug`, {
        params: {
            dispatch,
            slug,
            uxCritical: true,
        },
    }).then(
        (result) => {
            dispatch({
                payload: {
                    subGroupListLoader: true,
                },
                type: actionTypes.SUB_GROUP_LIST_LOADER,
            });
            dispatch({
                payload: {
                    campaignDetails: result.data,
                },
                type: actionTypes.GET_CAMPAIGN_FROM_SLUG,
            });
            // API call for subgroups
            if (result.data) {
                coreApi.get(`${result.data.relationships.subGroups.links.related}?page[size]=9`).then(
                    (subGroupResult) => {
                        dispatch({
                            payload: {
                                campaignSubGroupDetails: subGroupResult,
                            },
                            type: actionTypes.GET_SUB_GROUPS_FOR_CAMPAIGN,
                        });
                        dispatch({
                            payload: {
                                subGroupListLoader: false,
                            },
                            type: actionTypes.SUB_GROUP_LIST_LOADER,
                        });
                    },
                ).catch((error) => {
                    console.log(error);
                });
            }
            // API call for images
            if (result.data) {
                coreApi.get(result.data.relationships.galleryImages.links.related).then(
                    (galleryImagesResult) => {
                        dispatch({
                            payload: {
                                campaignImageGallery: galleryImagesResult.data,
                            },
                            type: actionTypes.GET_IMAGES_FOR_CAMPAIGN,
                        });
                    },
                ).catch((error) => {
                    console.log(error);
                });
            }
        },
    ).catch((error) => {
        console.log(error);
        Router.pushRoute('/give/error');
    });
};

export const generateDeepLink = (url, dispatch) => {
    const fsa = {
        payload: {
            deepLink: {},
        },
        type: actionTypes.DEEP_LINK_URL,
    };
    utilityApi.get(url).then(
        (result) => {
            fsa.payload.deepLink = result.data;
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => dispatch(fsa));
};

export const followProfile = (dispatch, userId, entityId, type) => {
    const fsa = {
        payload: {
            followStatus: false,
        },
    };
    const iconStatusFsa = {
        payload: {
            disableFollow: false,
        },
        type: actionTypes.DISABLE_FOLLOW_BUTTON,
    };
    // Must check types for other cases
    switch (type) {
        case 'campaigns':
            fsa.type = actionTypes.SAVE_FOLLOW_STATUS_CAMPAIGN;
            break;
        case 'groups':
            fsa.type = actionTypes.SAVE_FOLLOW_STATUS_GROUP;
            break;
        case 'beneficiaries':
            fsa.type = actionTypes.SAVE_FOLLOW_STATUS_CHARITY;
            break;
        default:
            break;
    }
    const payloadObj = generatePayloadBodyForFollowAndUnfollow(userId, entityId, type);
    graphApi.post(`core/create/relationship`, payloadObj).then(
        (result) => {
            fsa.payload.followStatus = true;
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => {
        dispatch(fsa);
        dispatch(iconStatusFsa);
        return null;
    });
};

export const unfollowProfile = (dispatch, userId, entityId, type) => {
    const fsa = {
        payload: {
            followStatus: true,
        },
    };
    const iconStatusFsa = {
        payload: {
            disableFollow: false,
        },
        type: actionTypes.DISABLE_FOLLOW_BUTTON,
    };
    // Must check types for other cases
    switch (type) {
        case 'campaigns':
            fsa.type = actionTypes.SAVE_FOLLOW_STATUS_CAMPAIGN;
            break;
        case 'groups':
            fsa.type = actionTypes.SAVE_FOLLOW_STATUS_GROUP;
            break;
        case 'beneficiaries':
            fsa.type = actionTypes.SAVE_FOLLOW_STATUS_CHARITY;
            break;
        default:
            break;
    }
    const payloadObj = generatePayloadBodyForFollowAndUnfollow(userId, entityId, type);
    graphApi.post(`/users/deleterelationship`, payloadObj).then(
        (result) => {
            fsa.payload.followStatus = false;
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => {
        dispatch(fsa);
        dispatch(iconStatusFsa);
        return null;
    });
};

export const campaignSubGroupSeeMore = (url, dispatch) => {
    return coreApi.get(url).then(
        (subGroupResult) => {
            dispatch({
                payload: {
                    seeMoreLoaderStatus: false,
                },
                type: actionTypes.SEE_MORE_LOADER,
            });
            dispatch({
                payload: {
                    campaignSubGroupDetails: subGroupResult,
                },
                type: actionTypes.GET_SUB_GROUPS_FOR_CAMPAIGN,
            });
        },
    ).catch((error) => {
        console.log(error);
    });
};
