import axios from "axios";
import {url} from '../config/url.api.js';

export const getStoreDataRequest = async (id) =>
    await axios.get(url + 'store/data', {
        params:
            {id: id}
    });
export const getStoreListRequest = async (month) =>
    await axios.get(url + 'store/storeSales', {
        params: 
            {month: month}
        });
export const getStoreSalesTotalsRequest = async (month) =>
    await axios.get(url + 'store/storeSalesTotals', {
        params: 
            {month: month}
        });
export const getStoreSalesForProductsRequest = async (month) =>
    await axios.get(url + 'store/storeSalesProducts', {
        params:
            {month: month}
        });
export const getStoreComparationSalesRequest = async (month) =>
    await axios.get(url + 'store/storeComparationSales', {
        params:
            {month: month}
        });
export const getStoreSalesRequest = async (month, id) =>
    await axios.get(url + 'store/storeSale', {
        params:
            {
                month: month,
                id: id
            }
    });

export const getStoreMonthDayRequest = async (month) =>
    await axios.get(url + 'store/storeSalesMonthDay', {
        params: {
            month: month
        }
    });

export const getStoreNameRequest = async () => 
    await axios.get(url + 'store/name');

export const getSalesStatisticsRequest = async () =>
    await axios.get(url + 'sales/statistics');

export const updateStoreRequest = async (id, data) =>
    await axios.patch(url + 'store/update', {
        params: {
            id: id
        },
        data
    });