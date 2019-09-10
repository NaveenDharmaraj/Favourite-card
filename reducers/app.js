import _isEmpty from 'lodash/isEmpty';
import _concat  from 'lodash/concat';
import _isEqual from 'lodash/isEqual';
import _uniqWith from 'lodash/uniqWith';
import _without from 'lodash/without';
const app = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'TRIGGER_UX_CRITICAL_ERROR':
            newState = {
                ...state,
                errors: (!_isEmpty(state.errors)) ?
                _uniqWith(_concat(state.errors, action.payload.errors), _isEqual)
                : action.payload.errors,
            };
            break;
        case 'DISMISS_UX_CRITICAL_ERROR':
            newState = {
                ...state,
                errors:_without(
                    state.errors,
                    action.payload.error
                ),
            };
            break;
        case 'DISMISS_ALL_UX_CRITICAL_ERROR':
            newState = {
                ...state,
                errors: []
            };
            break;
        default:
            break;
    }
    return newState;
};

export default app;
