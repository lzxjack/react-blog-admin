import { UPDATE_ECHART } from '../constant';

const initState = 0;

export default function addReducer(preState = initState, action) {
    const { type } = action;
    switch (type) {
        case UPDATE_ECHART:
            return preState === 1 ? 0 : 1;
        default:
            return preState;
    }
}
