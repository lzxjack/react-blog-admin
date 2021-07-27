import { GET_ARTICLES_NUM } from '../constant';

const initState = 0;

export default function addReducer(preState = initState, action) {
    const { type, data } = action;
    switch (type) {
        case GET_ARTICLES_NUM:
            return data;
        default:
            return preState;
    }
}
