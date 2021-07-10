import { GET_ARTICLES } from '../constant';

export const getArticles = data => ({
    type: GET_ARTICLES,
    data,
});
