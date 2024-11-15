import axios from "axios";
import {url} from '../config/url.api.js';

export const getCarsRequest = async () =>
    await axios.get(url + 'cart');

export const getCarRequest = async (id) =>
    await axios.get(url + 'cart/car', {
        params: {
            id: id
        }
    });

export const createCarRequest = async (data) =>
    await axios.post(url + 'cart', data);

export const updateCarRequest = async (id, data) =>
    await axios.patch(url + 'cart/update', {
        params: {
            id: id
        },
        data
    });

export const deleteCarRequest = async (id) =>
    await axios.delete(url + 'cart/delete', {
        params: {
            id: id
        }
    });