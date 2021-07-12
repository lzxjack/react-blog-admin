import { combineReducers } from 'redux';

import loginState from './loginState';
import tags from './tags';
import classes from './classes';
import articles from './articles';
import poem from './poem';
import articlesNum from './articlesNum';

export default combineReducers({
    loginState,
    tags,
    classes,
    articles,
    poem,
    articlesNum,
});
