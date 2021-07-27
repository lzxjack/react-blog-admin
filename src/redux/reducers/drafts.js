import { GET_DRAFTS } from '../constant';

const initState = [];

export default function addReducer(preState = initState, action) {
    const { type, data } = action;
    switch (type) {
        case GET_DRAFTS:
            return data;
        default:
            return preState;
    }
}
