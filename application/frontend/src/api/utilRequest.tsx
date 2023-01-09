/**
 * Generic request to the backend server
 * @param		{{url: string, method: string, data: Object|undefined}}	options		Specific request to send to backend
 * @param  {String}  contentType  Content Type of the request
 * @param  {String}  responseType  Type of the response
 * @returns {Promise<AxiosResponse<any>>} Response
 */
import {getAccessToken} from "./utils";
import axios from "axios";

// @ts-ignore
export const request = (options, contentType='application/json', responseType = null) => {
    let headers = {
        'Content-Type': contentType
    };
    if (getAccessToken()) {
        headers = {
            ...headers,
            // @ts-ignore
            Authorization: 'Bearer ' + getAccessToken(),
            'Sec-Fetch-Site': 'same-site',
    };
    }
    options = Object.assign({}, { headers: headers, responseType: responseType }, options);
    return axios(options)
        .then(({ data }) => {
            return data;
        });
};