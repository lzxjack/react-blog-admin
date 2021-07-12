import { GET_POEM } from '../constant';

export const getPoem = data => ({
    type: GET_POEM,
    data,
});
