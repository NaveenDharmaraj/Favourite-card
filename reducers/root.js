import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import onBoarding from './onBoarding';

const root = combineReducers({
    auth,
    give,
    onBoarding,
    user,
});

export default root;
