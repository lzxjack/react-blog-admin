import { GET_ARTICLES_NUM } from '../constant';

export const getArticlesNum = data => ({
    type: GET_ARTICLES_NUM,
    data,
});
