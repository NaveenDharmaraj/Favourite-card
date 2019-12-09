import _isEmpty from 'lodash/isEmpty';

import coreApi from '../services/coreApi';

export const actionTypes = {
    DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL_LOADER: 'DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL_LOADER',
    GET_INITIAL_TAX_RECEIPT_PROFILE: 'GET_INITIAL_TAX_RECEIPT_PROFILE',
    GET_PAGINATED_TAX_RECEIPT_PROFILE: 'GET_PAGINATED_TAX_RECEIPT_PROFILE',
    GET_PAGINATED_TAX_RECEIPT_PROFILE_LOADER: 'GET_PAGINATED_TAX_RECEIPT_PROFILE_LOADER',
    ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL: 'ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL',
    ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL: 'ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL',
    ISSUED_TAX_RECEIPTS_LIST: 'ISSUED_TAX_RECEIPTS_LIST',
    ISSUED_TAX_RECEIPTS_LIST_LOADER: 'ISSUED_TAX_RECEIPTS_LIST_LOADER',
};

export const getTaxReceiptProfilePaginated = (dispatch, userId, pageNumber, loadMore) => {
    const fsa = {
        payload: {
            taxReceiptProfileList: null,
        },
        type: actionTypes.GET_PAGINATED_TAX_RECEIPT_PROFILE,
    };
    dispatch({
        payload: {
            loader: !loadMore,
        },
        type: actionTypes.GET_PAGINATED_TAX_RECEIPT_PROFILE_LOADER,
    });
    coreApi.get(`/users/${userId}/taxReceiptProfiles?page[number]=${pageNumber}&page[size]=10`).then((result) => {
        fsa.payload.taxReceiptProfileList = result.data;
        fsa.payload.taxReceiptProfilePageCount = result.meta.pageCount;
    }).catch((error) => {
        // console.log(error);
    }).finally(() => {
        const type = pageNumber === 1 ? actionTypes.GET_INITIAL_TAX_RECEIPT_PROFILE : actionTypes.GET_PAGINATED_TAX_RECEIPT_PROFILE;
        fsa.type = type;
        dispatch(fsa);
        dispatch({
            payload: {
                loader: false,
            },
            type: actionTypes.GET_PAGINATED_TAX_RECEIPT_PROFILE_LOADER,
        });
    });
};
export const getTaxReceiptProfileMakeDefault = (taxRecptProfileId) => {
    return coreApi.patch(`taxReceiptProfiles/${taxRecptProfileId}/set_as_default`);
};
export const getIssuedTaxreceipts = (dispatch, url, viewMore = false) => {
    const fsa = {
        payload: {
            issuedTaxReceiptList: [],
        },
        type: actionTypes.ISSUED_TAX_RECEIPTS_LIST,
    };
    dispatch({
        payload: {
            issuedTaxLloader: !viewMore,
            viewMoreLoader: !!viewMore,
        },
        type: actionTypes.ISSUED_TAX_RECEIPTS_LIST_LOADER,
    });
    coreApi.get(url,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        }).then((result) => {
        fsa.payload.issuedTaxReceiptList = result.data;
        fsa.payload.issuedTaxLloader = false;
        fsa.payload.nextLink = !_isEmpty(result.links.next) ? result.links.next : null;
        fsa.payload.recordCount = result.recordCount;
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        dispatch(fsa);
        dispatch({
            payload: {
                issuedTaxLloader: false,
                viewMoreLoader: false,
            },
            type: actionTypes.ISSUED_TAX_RECEIPTS_LIST_LOADER,
        });
    });
};
export const getIssuedTaxreceiptYearlyDetail = (dispatch, id,) => {
    const fsa = {
        payload: {
            issuedTaxReceiptYearlyDetail: null,
        },
        type: actionTypes.ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL,
    };
    dispatch({
        payload: {
            yearLoader: true,
        },
        type: actionTypes.ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL,
    });
    coreApi.get(`/taxReceipts/${id}`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        }).then((result) => {
        fsa.payload.issuedTaxReceiptYearlyDetail = result.data;
        fsa.payload.yearLoader = false;
    }).catch((err) => {
        console.error(err);
        fsa.payload.yearLoader = false;
    }).finally(() => {
        dispatch(fsa);
    });
};

export const getIssuedTaxreceiptDonationsDetail = (dispatch, id, year, pageNumber) => {
    const fsa = {
        payload: {
            issuedTaxReceiptDonationsDetail: null,
        },
        type: actionTypes.ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL,
    };
    
    coreApi.get(`/taxReceipts/${id}?year=${year}&page[number]=${pageNumber}&page[size]=10`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
        }).then((result) => {
        fsa.payload.issuedTaxReceiptDonationsDetail = {
            [year]:{
                data: result.data,
                pageCount: result.pageCount
            }
        };
        fsa.payload.currentDonationYear = year;
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        dispatch(fsa);
    });
};

export const downloadTaxreceiptDonationsDetail = (dispatch, id, year) => {
    dispatch({
        payload: {
            downloadloader: true,
            currentYear: year,
        },
        type: actionTypes.DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL_LOADER,
    });
    return coreApi.get(`/taxReceipts/${id}?format=pdf&year=${year}`,
        {
            params: {
                dispatch,
                uxCritical: true,
            },
            responseType: 'blob',
        });
};
