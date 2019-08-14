import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import charity from './charity';
import dashboard from './dashboard';
import onBoarding from './onBoarding';
import app from './app';

const root = combineReducers({
    app,
    auth,
    dashboard,
    give,
    onBoarding,
    user,
    charity,
});

export default root;
