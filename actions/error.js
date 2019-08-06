import _keyBy from 'lodash/keyBy';
import _map from 'lodash/map';
import _without from 'lodash/without';
import React from 'react';
// import GeminiLink from 'client/common/components/GeminiLink';


const types = _keyBy([
    'DISMISS_UX_CRITICAL_ERROR',
    'TRIGGER_UX_CRITICAL_ERROR',
]);

const triggerUxCritialErrors = (errors = [], dispatch) => {
    const statusMessageProps = {
        heading: 'We’re sorry, something went wrong.',
        message: 'Please try again',
        type: 'error',
    };

    if (errors.length) {
        if (errors.length > 1) {
            statusMessageProps.items = _map(errors, 'detail');
        } else if (errors[0].detail) {
            statusMessageProps.message = errors[0].detail;
        }
    }

    return dispatch({
        payload: {
            errors: [ statusMessageProps ],
        },
        type: types.TRIGGER_UX_CRITICAL_ERROR,
    });
};

const dismissUxCritialErrors = (err, allErrors, dispatch) => {
    const errors = _without(
        allErrors,
        err,
    );

    dispatch({
        payload: {
            errors,
        },
        type: types.DISMISS_UX_CRITICAL_ERROR,
    });
};

const dismissAllUxCritialErrors = (dispatch) => {
    const errors = null;

    dispatch({
        payload: {
            errors,
        },
        type: types.DISMISS_UX_CRITICAL_ERROR,
    });
};

export {
    types as default,
    triggerUxCritialErrors,
    dismissUxCritialErrors,
    dismissAllUxCritialErrors,
};
