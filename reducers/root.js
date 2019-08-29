import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import charity from './charity';
import search from './search';
import dashboard from './dashboard';
import onBoarding from './onBoarding';
import app from './app';
import profile from './profile';

const root = combineReducers({
    app,
    auth,
    dashboard,
    give,
    search,
    onBoarding,
    profile,
    user,
    charity,
});

export default root;
