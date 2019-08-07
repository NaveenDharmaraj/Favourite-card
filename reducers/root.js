import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import charity from './charity';

const root = combineReducers({
    auth,
    give,
    user,
    charity,
});

export default root;
