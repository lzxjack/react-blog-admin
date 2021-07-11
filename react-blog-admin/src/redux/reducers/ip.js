import { GET_IP } from '../constant';

const initState = '';

export default function addReducer(preState = initState, action) {
    const { type, data } = action;
    switch (type) {
        case GET_IP:
            return data;
        default:
            return preState;
    }
}
