import { combineReducers } from 'redux';

import user from './user';
import give from './give';
import auth from './auth';
import charity from './charity';
import search from './search';
import dashboard from './dashboard';
import onBoarding from './onBoarding';
import app from './app';
import taxreceipt from './taxreceipt';
import profile from './profile';
import firebase from './firebase';
import chat from './chat';

const root = combineReducers({
    app,
    auth,
    dashboard,
    give,
    search,
    onBoarding,
    taxreceipt,
    profile,
    user,
    firebase,
    chat,
    charity,
});

export default root;
