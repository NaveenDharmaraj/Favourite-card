import _ from 'lodash';
const user = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'SET_USER_INFO':
            newState = {
                ...state,
                ...action.payload,
            };
            break;
        case 'UPDATE_USER_FUND':
            newState = {
                ...state,
                fund: {
                    ...state.fund,
                    ...action.payload.fund,
                },
                info: Object.assign({}, action.payload.info),
            };
            break;
        case 'GET_MATCH_POLICIES_PAYMENTINSTRUMENTS':
            const {
                companiesAccountsData,
                donationMatchData,
                paymentInstrumentsData,
                defaultTaxReceiptProfile,
                fund,
                taxReceiptProfiles,
                userAccountsFetched,
                userCampaigns,
                userGroups,
            } = action.payload;
            newState = {
                ...state,
                companiesAccountsData: Object.assign([], state.companiesAccountsData, companiesAccountsData),
                defaultTaxReceiptProfile: {
                    ...state.defaultTaxReceiptProfile,
                    ...defaultTaxReceiptProfile,
                },
                donationMatchData: Object.assign([], state.donationMatchData, donationMatchData),
                fund: {
                    ...state.fund,
                    ...fund,
                },
                paymentInstrumentsData: Object.assign([], state.paymentInstrumentsData, paymentInstrumentsData),
                taxReceiptProfiles: Object.assign([], state.taxReceiptProfiles, taxReceiptProfiles),
                userAccountsFetched: {
                    ...state.userAccountsFetched,
                    ...userAccountsFetched,
                },
                userCampaigns: Object.assign([], state.userCampaigns, userCampaigns),
                userGroups: Object.assign([], state.userGroups, userGroups),
            };
            break;
        case 'TAX_RECEIPT_PROFILES':
            newState = {
                ...state,
                taxReceiptGetApiStatus: action.payload.taxReceiptGetApiStatus,
                taxReceiptProfiles: Object.assign([], state.taxReceiptProfiles, action.payload.taxReceiptProfiles),
            };
            break;
        case 'SET_USER_TAX_API_STATUS_FALSE':
            newState = {
                ...state,
                taxReceiptGetApiStatus: action.payload.taxReceiptGetApiStatus,
            };
            break;
        case 'GET_USERS_GROUPS':
            newState = {
                ...state,
                userMembershipGroups: {
                    userGroups: action.payload.userMembershipGroups,
                },
            };
            break;
        case 'GIVING_GROUPS_AND_CAMPAIGNS':
            const {
                administeredGroups,
                administeredCampaigns,
            } = action.payload;
            newState = {
                ...state,
                administeredGroups: Object.assign({}, state.administeredGroups, action.payload.administeredGroups),
                administeredCampaigns: Object.assign({}, state.administeredCampaigns, action.payload.administeredCampaigns),
                groupsWithMemberships: Object.assign({}, state.groupsWithMemberships, action.payload.groupsWithMemberships),
            };
            break;
        case 'LEAVE_GROUP_ERROR_MESSAGE':
            newState = {
                ...state,
                leaveErrorMessage : action.payload,
            }
            break;
        case 'USER_GIVING_GOAL_DETAILS':
            newState = {
                ...state,
                userGivingGoalDetails: action.payload.userGivingGoalDetails,
            };
            break;
        case 'GET_UPCOMING_TRANSACTIONS':
            newState = {
                ...state,
                upcomingTransactions: action.payload.upcomingTransactions,
                upcomingTransactionsMeta: action.payload.upcomingTransactionsMeta,
            };
            break;
        case 'MONTHLY_TRANSACTION_API_CALL':
            newState = {
                ...state,
                monthlyTransactionApiCall: action.payload.apiCallStats,
            };
            break;
        case 'USER_FAVORITES':
            newState = {
                ...state,
                favorites: {
                    data: (!_.isEmpty(state.favorites) && !_.isEmpty(state.favorites.data)) ?
                    _.uniqWith(_.concat(state.favorites.data, action.payload.favorites.data), _.isEqual)
                    : action.payload.favorites.data,
                    pageCount: action.payload.favorites.pageCount,
                    dataCount: action.payload.favorites.dataCount,
                    currentPageNumber: action.payload.favorites.currentPageNumber,
                },
            };
            break;
        case 'UPDATE_FAVORITES':
            newState = {
                ...state,
                favorites: action.payload.favorites,
                disableFavorites: false,
            }
            break;
        case 'DISABLE_FAVORITES_BUTTON':
            newState = {
                ...state,
                disableFavorites: true,
            };
            break;
        case 'ENABLE_FAVORITES_BUTTON':
            newState = {
                ...state,
                disableFavorites: false,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default user;
