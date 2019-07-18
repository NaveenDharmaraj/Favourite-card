import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';

const root = combineReducers({
    auth,
    give,
    user,
});

export default root;
