import _ from 'lodash';

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
        case 'CLEAR_DATA_FOR_CAMPAIGNS':
            newState = {
                ...state,
                campaignSubGroupDetails: action.payload.campaignSubGroupDetails,
                campaignSubGroupsShowMoreUrl: null,
            };
            break;
        case 'GET_SUB_GROUPS_FOR_CAMPAIGN':
            // isViewMore used to ignore the initial componentDidMount call - duplicate groups
            if (state.campaignSubGroupDetails && state.campaignSubGroupDetails.length > 0 && action.payload.isViewMore) {
                const uniqueArray = _.uniqBy(_.concat(state.campaignSubGroupDetails, action.payload.campaignSubGroupDetails.data), 'id');
                newState = {
                    ...state,
                    campaignSubGroupDetails:[...uniqueArray],
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
                        liked: action.payload.followStatus,
                    },
                },
                // disableFollow: false,
            };
            break;
        case 'SLUG_API_ERROR_STATUS':
            newState = {
                ...state,
                slugApiErrorStats: action.payload.slugApiErrorStats,
            };
            break;
        case 'STORE_SEARCH_KEY_FOR_CAMPAIGN':
            newState = {
                ...state,
                searchData: action.payload.searchData,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default profile;
