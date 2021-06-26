import { combineReducers } from 'redux';

import loginState from './loginState';
import tags from './tags';
import classes from './classes';

export default combineReducers({
    loginState,
    tags,
    classes,
});
