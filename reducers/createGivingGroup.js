import { actionTypes } from "../actions/createGivingGroup";

const createGivingGroup = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case actionTypes.UPDATE_CREATE_GIVING_GROUP_OBJECT:
            newState = {
                ...state,
                createGivingGroupStoreFlowObject: action.payload,
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
            }
            break;
        case actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY_LOADER:
            newState = {
                ...state,
                charitiesSearchQueryBasedLoader: action.payload
            };
            break;
        default:
            break;
    }
    return newState;
};

export default createGivingGroup;
