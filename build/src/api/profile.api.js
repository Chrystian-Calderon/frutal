import axios from "axios";
import {url} from '../config/url.api.js';

export const getProfileRequest = async () =>
    await axios.get(url + 'profile');