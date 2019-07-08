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
        return dispatch(setTaxReceiptProfile(result.data))
    }).catch((error) => {
        console.log(error);
    })
}

export const setTaxReceiptProfile = (data) => {
    return (dispatch) => dispatch({type:actionTypes.TAX_RECEIPT_PROFILES, payload:{ taxReceiptProfiles:data}})
}

export const updateTaxReceiptProfile = (taxReceiptProfile, action, dispatch) => {
    let result = {};
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
        return coreApi.patch(`/taxReceiptProfiles/${taxReceiptProfile.id}`, {
            data: params.data,
        });
    } else {
        const params = {
            data: taxReceiptProfile,
        };
        return coreApi.post('/taxReceiptProfiles', {
            data: params.data,
            uxCritical: true,
        });
    }
    // return setTaxReceiptProfile(dispatch, result.data)
};
