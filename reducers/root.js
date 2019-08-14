import { combineReducers } from 'redux';

import user from './user';
import userProfile from './userProfile';
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
    userProfile,
});

export default root;
