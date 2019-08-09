import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import onBoarding from './onBoarding';
import app from './app';

const root = combineReducers({
    app,
    auth,
    give,
    onBoarding,
    user,
});

export default root;
