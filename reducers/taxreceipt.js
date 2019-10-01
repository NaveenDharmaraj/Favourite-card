import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _uniqBy from 'lodash/uniqBy';
import _cloneDeep from 'lodash/cloneDeep';

const taxreceipt = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_INITIAL_TAX_RECEIPT_PROFILE':
            newState = {
                ...state,
                loader: action.payload.loader,
                taxReceiptProfileList: action.payload.taxReceiptProfileList,
                taxReceiptProfilePageCount: action.payload.taxReceiptProfilePageCount,
            };
            break;
        case 'GET_PAGINATED_TAX_RECEIPT_PROFILE':
            const taxReceiptProfileListUnique = !_isEmpty(state.taxReceiptProfileList) ? [
                ...state.taxReceiptProfileList,
                ...action.payload.taxReceiptProfileList,
            ] : action.payload.taxReceiptProfileList;
            newState = {
                ...state,
                loader: action.payload.loader,
                taxReceiptProfileList: _uniqBy(taxReceiptProfileListUnique, 'id'),
                taxReceiptProfilePageCount: action.payload.taxReceiptProfilePageCount,
            };
            break;
        case 'GET_PAGINATED_TAX_RECEIPT_PROFILE_LOADER':
            newState = {
                ...state,
                loader: action.payload.loader,
            };
            break;
        case 'UPDATE_TAX_RECEIPT_PROFILE':
            const { taxReceiptProfileList } = state;
            const editTaxProfile = _cloneDeep(action.payload.editedTaxProfile);
            const index = _findIndex(taxReceiptProfileList, (taxReceiptProfile) => taxReceiptProfile.id === editTaxProfile.id);
            if (!_isEmpty(editTaxProfile) && !_isEmpty(editTaxProfile.attributes) && editTaxProfile.attributes.isDefault) {
                if (!_isEmpty(state.defaultTaxId)) {
                    taxReceiptProfileList.find((taxReceiptProfile) => {
                        if (taxReceiptProfile.id === state.defaultTaxId) {
                            taxReceiptProfile.attributes.isDefault = false;
                            return taxReceiptProfile;
                        }
                    });
                }
            }
            taxReceiptProfileList.splice(index, 1, editTaxProfile);
            newState = {
                ...state,
                taxReceiptProfileList: Object.assign([], taxReceiptProfileList),
            };
            break;
        case 'ADD_TAX_RECEIPT_PROFILE':
            const AddTaxProfile = _cloneDeep(action.payload.editedTaxProfile);
            if (!_isEmpty(AddTaxProfile) && !_isEmpty(AddTaxProfile.attributes) && AddTaxProfile.attributes.isDefault) {
                if (!_isEmpty(state.defaultTaxId)) {
                    state.taxReceiptProfileList.find((taxReceiptProfile) => {
                        if (taxReceiptProfile.id === state.defaultTaxId) {
                            taxReceiptProfile.attributes.isDefault = false;
                            return taxReceiptProfile;
                        }
                    });
                }
            }
            state.taxReceiptProfileList.push(AddTaxProfile);
            newState = {
                ...state,
                taxReceiptProfileList: Object.assign([], state.taxReceiptProfileList),
            };
            break;
        case 'DEFAULT_TAX_RECEIPT_PROFILE_ID':
            newState = {
                ...state,
                defaultTaxId: action.payload.defaultTaxId,
            };
            break;
        case 'ISSUED_TAX_RECEIPTS_LIST':
            newState = {
                ...state,
                issuedTaxLloader: action.payload.issuedTaxLloader,
                issuedTaxReceiptList: action.payload.issuedTaxReceiptList,
            };
            break;
        case 'ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL':
            newState = {
                ...state,
                issuedTaxReceiptYearlyDetail: action.payload.issuedTaxReceiptYearlyDetail,
                yearLoader: action.payload.yearLoader,
            };
            break;
        case 'ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL':
            newState = {
                ...state,
                issuedTaxReceiptDonationsDetail: action.payload.issuedTaxReceiptDonationsDetail,
                issuedTaxReceiptYearlyDetailPageCount: action.payload.issuedTaxReceiptYearlyDetailPageCount,
            };
            break;
        case 'DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL':
            newState = {
                ...state,
                downloadloader: action.payload.downloadloader,
                url: action.payload.url,
                urlChange: action.payload.urlChange,
                year: action.payload.year,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default taxreceipt;
