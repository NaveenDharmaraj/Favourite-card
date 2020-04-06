import _keyBy from 'lodash/keyBy';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
// import GeminiLink from 'client/common/components/GeminiLink';


const types = _keyBy([
    'DISMISS_ALL_UX_CRITICAL_ERROR',
    'DISMISS_UX_CRITICAL_ERROR',
    'TRIGGER_UX_CRITICAL_ERROR',
]);

const triggerUxCritialErrors = (errors = [], dispatch) => {
    const statusMessageProps = {
        heading: 'We’re sorry, something went wrong.',
        message: 'Please try again',
        type: 'error',
    };
    const details = [];
    if (errors.length) {
        if (errors.length > 1) {
            errors.map((err) => {
                if (!_isEmpty(err.detail) && _isString(err.detail)) {
                    details.push(err.detail);
                }
            });
            statusMessageProps.items = details;
        } else if (!_isEmpty(errors[0].detail) && _isString(errors[0].detail)) {
            statusMessageProps.message = errors[0].detail;
        }
    }

    return dispatch({
        payload: {
            errors: [
                statusMessageProps,
            ],
        },
        type: types.TRIGGER_UX_CRITICAL_ERROR,
    });
};

const dismissUxCritialErrors = (err, dispatch) => {
    dispatch({
        payload: {
            error: err,
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
        type: types.DISMISS_ALL_UX_CRITICAL_ERROR,
    });
};

const triggerCustomUxCriticalError = (messageProps, dispatch) => {
    dispatch({
        payload: {
            errors: [
                messageProps,
            ],
        },
        type: types.TRIGGER_UX_CRITICAL_ERROR,
    });
};

export {
    types as default,
    triggerUxCritialErrors,
    dismissUxCritialErrors,
    dismissAllUxCritialErrors,
    triggerCustomUxCriticalError,
};
