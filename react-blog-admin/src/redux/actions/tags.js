import { GET_TAGS } from '../constant';

export const getTags = data => ({
    type: GET_TAGS,
    data,
});
