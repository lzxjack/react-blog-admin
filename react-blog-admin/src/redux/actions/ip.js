import { GET_IP } from '../constant';

export const getIP = data => ({
    type: GET_IP,
    data,
});
