import axios from "axios";
import {url} from '../config/url.api.js';

export const getDistributorNameRequest = async () =>
    await axios.get(url + 'distributors/name');