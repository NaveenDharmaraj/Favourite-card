import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import app from './app';

const root = combineReducers({
    app,
    auth,
    give,
    user,
});

export default root;
