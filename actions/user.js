import coreApi from '../services/coreApi';

export const actionTypes = {
    USER_AUTH: 'USER_AUTH'
}

export const validateUser = (dispatch) => {
    return coreApi.get('/users/888000?include=chimpAdminRole,donorRole,fund').then((result) => {
        return dispatch({type: actionTypes.USER_AUTH, payload: {isAuthenticated: true}})
    }).catch((error) => {
        console.log(JSON.stringify(error));
    });
    
}