import axios from "axios";
import {url} from '../config/url.api.js';

export const getProductsRequest = async () =>
    await axios.get(url + 'products');

export const getProductsNameRequest = async () =>
    await axios.get(url + 'products/name');

export const getProductsAdditions = async () =>
    await axios.get(url + 'products/additions');

export const createIcecreamRequest = async (data) =>
    await axios.post(url + 'products/icecream', data);

export const createAdditionRequest = async (data) =>
    await axios.post(url + 'products/addition', data);

export const getIcecreamRequest = async (id) =>
    await axios.get(url + 'products/icecream', {
        params: {
            id: id
        }
    });

export const getAdditionRequest = async (id) =>
    await axios.get(url + 'products/addition', {
        params: {
            id: id
        }
    });

export const updateIcecreamRequest = async (id, data) =>
    await axios.patch(url + 'products/icecream', {
        params: {
            id: id
        },
        data
    });
    
export const updateAdditionRequest = async (id, data) =>
    await axios.patch(url + 'products/addition', {
        params: {
            id: id
        },
        data
    });

export const deleteProductRequest = async (id) =>
    await axios.delete(url + 'products/delete', {
        params: {
            id: id
        }
    });