const search = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_DEFAULT_CHARITIES':
            newState = {
                ...state,
                charityFlag: action.payload.charityFlag,
                defaultAllCharities: action.payload.defaultAllCharities,
                pageCount: action.payload.pageCount,
            };
            break;
        case 'GET_DEFAULT_CHARITIES_GROUPS':
            newState = {
                ...state,
                charityFlag: action.payload.charityFlag,
                defaultAllCharities: action.payload.defaultAllCharities,
                defaultAllGroups: action.payload.defaultAllGroups,
                groupFlag: action.payload.groupFlag,
            };
            break;
        case 'GET_DEFAULT_GROUPS':
            newState = {
                ...state,
                defaultAllGroups: action.payload.defaultAllGroups,
                groupFlag: action.payload.groupFlag,
                pageCount: action.payload.pageCount,
            };
            break;
        case 'GET_TEXT_SEARCHED_CHARITIES_GROUPS':
            newState = {
                ...state,
                charityFlag: action.payload.charityFlag,
                pageCount: action.payload.pageCount,
                TextSearchedCharitiesGroups: action.payload.TextSearchedCharitiesGroups,
                
            };
            break;
        case 'GET_TEXT_SEARCHED_CHARITIES':
            newState = {
                ...state,
                charityFlag: action.payload.charityFlag,
                pageCount: action.payload.pageCount,
                TextSearchedCharities: action.payload.TextSearchedCharities,
            };
            break;
        case 'GET_TEXT_SEARCHED_GROUPS':
            newState = {
                ...state,
                groupFlag: action.payload.groupFlag,
                pageCount: action.payload.pageCount,
                TextSearchedGroups: action.payload.TextSearchedGroups,
            };
            break;
        case 'GET_API_DATA_FECHED_FLAG':
            newState = {
                ...state,
                charityFlag: action.payload.charityFlag,
                groupFlag: action.payload.groupFlag,
            };
            break;
        case 'DISPATCH_FILTER_DATA':
            newState = {
                ...state,
                filterData: action.payload.filterData,
            };
            break;
        case 'DISPATCH_FILTER_VALUE_SHOWED':
            newState = {
                ...state,
                filterValuesShowed: action.payload.filterValuesShowed,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default search;
