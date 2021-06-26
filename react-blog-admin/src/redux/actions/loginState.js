import { LOGIN, LOGOUT } from '../constant';

export const login = data => ({
    type: LOGIN,
    data,
});

export const logout = data => ({
    type: LOGOUT,
    data,
});
