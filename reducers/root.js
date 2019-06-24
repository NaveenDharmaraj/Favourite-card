import { combineReducers } from 'redux';

import user from './user';
import give from './give';

const root = combineReducers({
    user: user,
    give
});

export default root
