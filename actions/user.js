import coreApi from '../services/coreApi';
import _pick from 'lodash/pick';

export const actionTypes = {
    USER_AUTH: 'USER_AUTH',
    TAX_RECEIPT_PROFILES: 'TAX_RECEIPT_PROFILES'
}

export const validateUser = (dispatch) => {
    return coreApi.get('/users/999000?include=chimpAdminRole,donorRole,fund').then((result) => {
        return dispatch({type: actionTypes.USER_AUTH, payload: {isAuthenticated: true}})
    }).catch((error) => {
        console.log(JSON.stringify(error));
    });   
}

export const getTaxReceiptProfile = (dispatch,userId) => {
    return coreApi.get(`/users/${userId}/taxReceiptProfiles`).then((result) => {
        console.log('api result');
        console.log(result.data);
        return dispatch({type:actionTypes.TAX_RECEIPT_PROFILES, payload:{ taxReceiptProfiles:result.data}})
    }).catch((error) => {
        console.log(error);
    })
}

export const updateTaxReceiptProfile = (taxReceiptProfile, action) => {
    let result = {};
    console.log('inside actions');
    console.log(taxReceiptProfile)
    if (action === 'update') {
        const params = {
            data: {
                attributes: _pick(
                    taxReceiptProfile.attributes,
                    [
                        'addressOne',
                        'addressTwo',
                        'city',
                        'country',
                        'fullName',
                        'postalCode',
                        'province',
                    ],
                ),
                id: taxReceiptProfile.id,
                type: taxReceiptProfile.type,
            },
        };
        result = coreApi.patch(`/taxReceiptProfiles/${taxReceiptProfile.id}`, {
            data: params.data,
        });
        console.log(result)
    } else {
        const params = {
            data: taxReceiptProfile,
        };
        result = coreApi.post('/taxReceiptProfiles', {
            data: params.data,
            uxCritical: true,
        });
        console.log(result)
    }
    return result;
};
