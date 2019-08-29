/* eslint-disable no-else-return */

import _ from 'lodash';

import coreApi from '../services/coreApi';


export const actionTypes = {
    DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL: 'DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL',
    GET_PAGINATED_TAX_RECEIPT_PROFILE: 'GET_PAGINATED_TAX_RECEIPT_PROFILE',
    ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL: 'ISSUED_TAX_RECEIPIENT_DONATIONS_DETAIL',
    ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL: 'ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL',
    ISSUED_TAX_RECEIPTS_LIST: 'ISSUED_TAX_RECEIPTS_LIST',
};

export const getTaxReceiptProfilePaginated = (dispatch, userId, pageNumber) => {
    const fsa = {
        payload: {
            taxReceiptProfileList: null,
        },
        type: actionTypes.GET_PAGINATED_TAX_RECEIPT_PROFILE,
    };
    coreApi.get(`/users/${userId}/taxReceiptProfiles?page[number]=${pageNumber}&page[size]=10`).then((result) => {
        fsa.payload.taxReceiptProfileList = result.data;
        fsa.payload.taxReceiptProfilePageCount = result.meta.pageCount;
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        dispatch(fsa);
    });
};
export const getTaxReceiptProfileMakeDefault = (taxRecptProfileId) => {
    return coreApi.patch(`taxReceiptProfiles/${taxRecptProfileId}/set_as_default`);
};
export const getIssuedTaxreceipts = (dispatch) => {
    const fsa = {
        payload: {
            issuedTaxReceiptList: null,
        },
        type: actionTypes.ISSUED_TAX_RECEIPTS_LIST,
    };
    coreApi.get('/taxReceipts').then((result) => {
        fsa.payload.issuedTaxReceiptList = result.data;
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        dispatch(fsa);
    });
};
export const getIssuedTaxreceiptYearlyDetail = (dispatch, id,) => {
    const fsa = {
        payload: {
            issuedTaxReceiptYearlyDetail: null,
        },
        type: actionTypes.ISSUED_TAX_RECEIPIENT_YEARLY_DETAIL,
    };
    coreApi.get(`/taxReceipts/${id}`).then((result) => {
        fsa.payload.issuedTaxReceiptYearlyDetail = result.data;
    }).catch((err) => {
        console.error(err);
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
    coreApi.get(`/taxReceipts/${id}?year=${year}&page[number]=${pageNumber}&page[size]=10`).then((result) => {
        fsa.payload.issuedTaxReceiptDonationsDetail = result.data;
        fsa.payload.issuedTaxReceiptYearlyDetailPageCount = result.pageCount;
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        dispatch(fsa);
    });
};

export const downloadTaxreceiptDonationsDetail = (dispatch, id, year) => {
    const fsa = {
        payload: {
            url: null,
        },
        type: actionTypes.DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL,
    };
    dispatch({
        payload: {
            urlChange: false,
        },
        type: actionTypes.DOWNLOAD_TAX_RECEIPT_DONATION_DETAIL,
    });
    coreApi.get(`/taxReceipts/${id}?format=pdf&year=${year}`).then((result) => {
        const blob = new Blob([
            result,
        ], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        fsa.payload.url = url;
        fsa.payload.urlChange = true;
        fsa.payload.year = year;
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        dispatch(fsa);
    });
};
