import { combineReducers } from 'redux';

import user from './user';
import userProfile from './userProfile';
import give from './give';
import auth from './auth';
import charity from './charity';
import search from './search';
import dashboard from './dashboard';
import onBoarding from './onBoarding';
import app from './app';
import group from './group';
import taxreceipt from './taxreceipt';
import profile from './profile';
import firebase from './firebase';
import chat from './chat';
import createGivingGroup from './createGivingGroup';

const root = combineReducers({
    app,
    auth,
    charity,
    chat,
    createGivingGroup,
    dashboard,
    firebase,
    give,
    group,
    onBoarding,
    profile,
    search,
    taxreceipt,
    user,
    userProfile,
});

export default root;
