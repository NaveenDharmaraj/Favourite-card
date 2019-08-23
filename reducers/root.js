import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import charity from './charity';
import search from './search';
import dashboard from './dashboard';
import onBoarding from './onBoarding';
import app from './app';
import group from './group';

const root = combineReducers({
    app,
    auth,
    dashboard,
    give,
    group,
    search,
    onBoarding,
    user,
    charity,
});

export default root;
