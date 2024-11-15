import axios from "axios";
import {url} from '../config/url.api.js';

export const getSalesRequest = async (number) =>
    await axios.get(url + 'sales', {
        params: {
            id: number
        }
    });

export const getSalesReportRequest = async (store, timePeriod, month) =>
    await axios.get(url + 'sales/report', {
        params: {
            store: store,
            timePeriod: timePeriod,
            month: month
        }
    });

export const getSalesDateRequest = async (timePeriod) =>
    await axios.get(url + 'sales/statistics', {
        params: {
            timePeriod: timePeriod
        }
    });

export const getSaleRequest = async (id) =>
    await axios.get(url + 'sales/edit', {
        params: {
            id: id
        }
    });

export const createSaleRequest = async (data) =>
    await axios.post(url + 'sales', data);

export const updateSaleRequest = async (id, data) =>
    await axios.patch(url + 'sales/update', {
        params: {
            id: id
        },
        data
    });

    export const deleteSaleRequest = async (id) =>
        await axios.delete(url + 'sales/delete', {
            params: {
                id: id
            }
        });