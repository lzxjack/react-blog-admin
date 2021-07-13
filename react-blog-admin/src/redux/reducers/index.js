import { combineReducers } from 'redux';

import loginState from './loginState';
import tags from './tags';
import classes from './classes';
import articles from './articles';
import drafts from './drafts';
import poem from './poem';
import articlesNum from './articlesNum';

import galleries from './galleries';
import links from './links';
import logs from './logs';
import says from './says';
import shows from './shows';
import about from './about';

export default combineReducers({
    loginState,
    tags,
    classes,
    articles,
    poem,
    articlesNum,
    drafts,
    galleries,
    links,
    logs,
    says,
    shows,
    about,
});
