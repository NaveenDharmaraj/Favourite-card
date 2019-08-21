import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import search from './search';
import dashboard from './dashboard';
import onBoarding from './onBoarding';
import app from './app';

const root = combineReducers({
    app,
    auth,
    dashboard,
    give,
    search,
    onBoarding,
    user,
});

export default root;
