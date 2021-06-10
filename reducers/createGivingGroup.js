import { actionTypes } from '../actions/createGivingGroup';

const createGivingGroup = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case actionTypes.UPDATE_EDIT_GIVING_GROUP_OBJECT:
            newState = {
                ...state,
                editGivingGroupStoreFlowObject: action.payload,
            };
            break;
        case actionTypes.UPDATE_CREATE_GIVING_GROUP_OBJECT:
            newState = {
                ...state,
                createGivingGroupStoreFlowObject: action.payload,
            };
            break;
        case actionTypes.GET_PROVINCE_LIST:
            newState = {
                ...state,
                provinceOptions: action.payload,
            };
            break;
        case actionTypes.GET_PROVINCES_LIST_LOADER:
            newState = {
                ...state,
                provincesListLoader: action.payload,
            };
            break;
        case actionTypes.GET_UNIQUE_CITIES:
            newState = {
                ...state,
                uniqueCities: action.payload,
            };
            break;
        case actionTypes.GET_UNIQUE_CITIES_LOADER:
            newState = {
                ...state,
                uniqueCitiesLoader: action.payload,
            };
            break;
        case actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY:
            newState = {
                ...state,
                charitiesQueryBasedOptions: action.payload
            };
            break;
        case actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER:
            newState = {
                ...state,
                charitiesSearchQueryBasedLoader: action.payload
            };
            break;
        case actionTypes.GET_GROUP_MEMBERS_ROLES:
            newState = {
                ...state,
                groupMemberCount: action.payload.meta.recordCount,
                groupMemberPageCount: action.payload.meta.pageCount,
                groupMemberRoles: action.payload.data,
            };
            break;
        case actionTypes.GET_GROUP_PENDING_INVITES:
            newState = {
                ...state,
                groupPendingInvites: action.payload,
            };
            break;
        case actionTypes.SHOW_PENDING_INVITES_PLACEHOLDER:
            newState = {
                ...state,
                pendingPlaceholderStatus: action.payload.status,
            };
            break;
        case actionTypes.SHOW_GROUP_MEMBERS_PLACEHOLDER:
            newState = {
                ...state,
                groupMemberPlaceholderStatus: action.payload.status,
            };
            break;
        case actionTypes.GET_GROUP_WIDGET_CODE:
            newState = {
                ...state,
                widgetCode: action.payload,
            };
            break;
        case actionTypes.GET_GROUP_FRIEND_LIST:
            newState = {
                ...state,
                friendsList: action.payload.data,
                friendsListCount: action.payload.meta.recordCount,
                friendsListPageCount: action.payload.meta.pageCount,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default createGivingGroup;
