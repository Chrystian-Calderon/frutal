import axios from "axios";
import {url} from '../config/url.api.js';

export const getProductsRequest = async () =>
    await axios.get(url + 'products');

export const getProductsNameRequest = async () =>
    await axios.get(url + 'products/name');

export const getProductsAdditions = async () =>
    await axios.get(url + 'products/additions');