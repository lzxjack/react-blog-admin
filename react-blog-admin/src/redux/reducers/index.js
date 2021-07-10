import { combineReducers } from 'redux';

import loginState from './loginState';
import tags from './tags';
import classes from './classes';
import articles from './articles';
import chartState from './updataChart';

export default combineReducers({
    loginState,
    tags,
    classes,
    articles,
    chartState,
});
