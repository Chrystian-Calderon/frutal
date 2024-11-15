import axios from "axios";
import {url} from '../config/url.api.js';

export const getUsersRequest = async () =>
    await axios.get(url + 'users/info');

export const getUserRequest = async (id) =>
    await axios.get(url + 'users/edit', {
        params: {
            id: id
        }
    });

export const getPermissionsRequest = async (id) =>
    await axios.get(url + 'users/permissions', {
        params: {
            id: id
        }
    });

export const getUserStoreRequest = async (id) =>
    await axios.get(url + 'users/userStore', {
        params: {
            id: id
        }
    });

export const updateUserRequest = async (id, data) =>
    await axios.patch(url + 'users/update', {
        params: {
            id: id
        },
        data
    });

export const getLogin = async (date) =>
    await axios.post(url + 'users/getLogin', date);
export const verifyTokenRequest = async (token) =>
    await axios.post(url + 'users/verifyToken', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

export const createUserRequest = async (data) =>
    await axios.post(url + 'users', data);