const profile = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_CAMPAIGN_FROM_SLUG':
            newState = {
                ...state,
                campaignDetails: Object.assign({}, action.payload.campaignDetails),
            };
            break;
        case 'GET_SUB_GROUPS_FOR_CAMPAIGN':
            if (state.campaignSubGroupDetails) {
                newState = {
                    ...state,
                    campaignSubGroupDetails: state.campaignSubGroupDetails.concat(action.payload.campaignSubGroupDetails.data),
                    campaignSubGroupsShowMoreUrl: action.payload.campaignSubGroupDetails.links.next,
                };
            } else {
                newState = {
                    ...state,
                    campaignSubGroupDetails: Object.assign([], action.payload.campaignSubGroupDetails.data),
                    campaignSubGroupsShowMoreUrl: action.payload.campaignSubGroupDetails.links.next,
                };
            }
            break;
        case 'SUB_GROUP_LIST_LOADER':
            newState = {
                ...state,
                subGroupListLoader: action.payload.subGroupListLoader,
            };
            break;
        case 'DEEP_LINK_URL':
            newState = {
                ...state,
                deepLinkUrl: action.payload.deepLink,
            };
            break;
        case 'DISABLE_FOLLOW_BUTTON':
            newState = {
                ...state,
                disableFollow: action.payload.disableFollow,
            };
            break;
        case 'SEE_MORE_LOADER':
            newState = {
                ...state,
                seeMoreLoaderStatus: action.payload.seeMoreLoaderStatus,
            };
            break;
        case 'GET_IMAGES_FOR_CAMPAIGN':
            newState = {
                ...state,
                campaignImageGallery: Object.assign([], action.payload.campaignImageGallery),
            };
            break;
        case 'SAVE_FOLLOW_STATUS_CAMPAIGN':
            newState = {
                ...state,
                campaignDetails: {
                    ...state.campaignDetails,
                    attributes: {
                        ...state.campaignDetails.attributes,
                        following: action.payload.followStatus,
                    },
                },
                // disableFollow: false,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default profile;
