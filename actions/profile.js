/* eslint-disable no-else-return */
import _ from 'lodash';
import getConfig from 'next/config';

import coreApi from '../services/coreApi';
import utilityApi from '../services/utilityApi';
import graphApi from '../services/graphApi';

const { publicRuntimeConfig } = getConfig();

const {
    BASIC_AUTH_KEY,
} = publicRuntimeConfig;

let BASIC_AUTH_HEADER = null;
if (!_.isEmpty(BASIC_AUTH_KEY)) {
    BASIC_AUTH_HEADER = {
        headers: {
            Authorization: `Basic ${BASIC_AUTH_KEY}`,
        },
    };
}
export const generatePayloadBodyForFollowAndUnfollow = (userId, id, type) => {

    let filterObj = {};
    let relationship;
    switch (type) {
        case 'beneficiaries':
        case 'charity':
            filterObj = {
                entity: 'charity',
                filters: {
                    charity_id: Number(id),
                },
            };
            relationship = 'FOLLOWS';
            break;
        case 'campaigns':
        case 'groups':
        case 'group':
            filterObj = {
                entity: 'group',
                filters: {
                    group_id: Number(id),
                },
            };
            relationship = 'LIKES';
            break;
        default:
            break;
    }
    const payloadObj = {
        relationship,
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
    CLEAR_DATA_FOR_CAMPAIGNS: 'CLEAR_DATA_FOR_CAMPAIGNS',
    DEEP_LINK_URL: 'DEEP_LINK_URL',
    DISABLE_FOLLOW_BUTTON: 'DISABLE_FOLLOW_BUTTON',
    GET_CAMPAIGN_FROM_SLUG: 'GET_CAMPAIGN_FROM_SLUG',
    GET_IMAGES_FOR_CAMPAIGN: 'GET_IMAGES_FOR_CAMPAIGN',
    GET_SUB_GROUPS_FOR_CAMPAIGN: 'GET_SUB_GROUPS_FOR_CAMPAIGN',
    SAVE_FOLLOW_STATUS_CAMPAIGN: 'SAVE_FOLLOW_STATUS_CAMPAIGN',
    SAVE_FOLLOW_STATUS_CHARITY: 'SAVE_FOLLOW_STATUS_CHARITY',
    SAVE_FOLLOW_STATUS_GROUP: 'SAVE_FOLLOW_STATUS_GROUP',
    SEE_MORE_LOADER: 'SEE_MORE_LOADER',
    SLUG_API_ERROR_STATUS: 'SLUG_API_ERROR_STATUS',
    SUB_GROUP_LIST_LOADER: 'SUB_GROUP_LIST_LOADER',
};

export const getCampaignSupportGroups = (id, searchKey = '', pageNumber = 1, pageSize = 6) => async (dispatch) => {
    dispatch({
        payload: {
            campaignSubGroupDetails: [],
        },
        type: actionTypes.CLEAR_DATA_FOR_CAMPAIGNS,
    });
    dispatch({
        payload: {
            subGroupListLoader: true,
        },
        type: actionTypes.SUB_GROUP_LIST_LOADER,
    });

    let fullParams;
    if (_.isEmpty(searchKey)) {
        fullParams = {
            params: {
                dispatch,
                ignore401: true,
                uxCritical: true,
                'page[number]': pageNumber,
                'page[size]': pageSize,
            },
        };
    }
    else {
        fullParams = {
            params: {
                'page[number]': pageNumber,
                'page[size]': pageSize,
                'filter[name]': searchKey,
            }
        }
    };
    await coreApi.get(`campaigns/${id}/subGroups`, {
        ...fullParams,
    }).then((subGroupSearchResult) => {
        dispatch({
            payload: {
                subGroupListLoader: false,
            },
            type: actionTypes.SUB_GROUP_LIST_LOADER,
        });
        dispatch({
            payload: {
                campaignSubGroupDetails: subGroupSearchResult,
            },
            type: actionTypes.GET_SUB_GROUPS_FOR_CAMPAIGN,
        });
    })
        .catch((error) => {
            // console.log(error);
        })
};

export const getCampaignFromSlug = async (dispatch, slug, token = null) => {
    dispatch({
        payload: {
            slugApiErrorStats: false,
        },
        type: actionTypes.SLUG_API_ERROR_STATUS,
    });
    dispatch({
        payload: {
            campaignSubGroupDetails: [],
        },
        type: actionTypes.CLEAR_DATA_FOR_CAMPAIGNS,
    });
    const fullParams = {
        params: {
            dispatch,
            findBySlug: true,
            slug,
            uxCritical: true,
        },
    };
    if (!_.isEmpty(token)) {
        fullParams.headers = {
            Authorization: `Bearer ${token}`,
        };
    }
    // return coreApi.get(`campaign/find_by_slug`, {
    await coreApi.get(`campaigns/find_by_slug`, {
        ...fullParams,
    }).then(
        async (result) => {
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
            const fullParams = {
                params: {
                    dispatch,
                    ignore401: true,
                    uxCritical: true,
                },
            };
            if (!_.isEmpty(token)) {
                fullParams.headers = {
                    Authorization: `Bearer ${token}`,
                };
            };
            await dispatch(getCampaignSupportGroups(result.data.id));

            // API call for images
            if (result.data) {
                coreApi.get(result.data.relationships.galleryImages.links.related,
                    {
                        ...fullParams,
                    }).then(
                    (galleryImagesResult) => {
                        dispatch({
                            payload: {
                                campaignImageGallery: galleryImagesResult.data,
                            },
                            type: actionTypes.GET_IMAGES_FOR_CAMPAIGN,
                        });
                    },
                ).catch((error) => {
                    // console.log(error);
                });
            }
        },
    ).catch((error) => {
        // console.log(error);
        dispatch({
            payload: {
                slugApiErrorStats: true,
            },
            type: actionTypes.SLUG_API_ERROR_STATUS,
        });
        // Router.pushRoute('/give/error');
    });
};

export const generateDeepLink = (url, dispatch) => {
    const fsa = {
        payload: {
            deepLink: {},
        },
        type: actionTypes.DEEP_LINK_URL,
    };
    utilityApi.get(url, BASIC_AUTH_HEADER, {
        params: {
            dispatch,
            ignore401: true,
            uxCritical: true,
        },
    }).then(
        (result) => {
            fsa.payload.deepLink = result.data;
        },
    ).catch((error) => {
        // console.log(error);
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
    graphApi.post(`core/create/relationship`, payloadObj, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then(
        (result) => {
            fsa.payload.followStatus = true;
        },
    ).catch((error) => {
        // console.log(error);
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
    graphApi.post(`/users/deleterelationship`, payloadObj, {
        params: {
            dispatch,
            ignore401: true,
        },
    }).then(
        (result) => {
            fsa.payload.followStatus = false;
        },
    ).catch((error) => {
        // console.log(error);
    }).finally(() => {
        dispatch(fsa);
        dispatch(iconStatusFsa);
        return null;
    });
};

export const campaignSubGroupSeeMore = (url, dispatch, isViewMore) => {
    return coreApi.get(url, {
        params: {
            dispatch,
            ignore401: true,
            uxCritical: true,
        },
    }).then(
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
                    isViewMore,
                },
                type: actionTypes.GET_SUB_GROUPS_FOR_CAMPAIGN,
            });
        },
    ).catch((error) => {
        // console.log(error);
    });
};
