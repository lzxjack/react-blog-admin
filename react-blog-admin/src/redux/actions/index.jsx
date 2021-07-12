import {
    GET_ARTICLES,
    GET_CLASSES,
    GET_ARTICLES_NUM,
    LOGIN,
    GET_POEM,
    GET_TAGS,
} from '../constant';

// 登录
export const login = data => ({
    type: LOGIN,
    data,
});

// 获得所有文章
export const getArticles = data => ({
    type: GET_ARTICLES,
    data,
});

// 获得所有分类
export const getClasses = data => ({
    type: GET_CLASSES,
    data,
});

// 获得所有标签
export const getTags = data => ({
    type: GET_TAGS,
    data,
});

// 获得文章数量
export const getArticlesNum = data => ({
    type: GET_ARTICLES_NUM,
    data,
});

// 获得每日诗句信息
export const getPoem = data => ({
    type: GET_POEM,
    data,
});
