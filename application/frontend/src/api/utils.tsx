import {Configuration} from "@unece/cotton-fetch";

const UNECE_COTTON_ACCESS_TOKEN = 'UNECE_COTTON_ACCESS_TOKEN';

export const getAccessToken = () => {
    return localStorage.getItem(UNECE_COTTON_ACCESS_TOKEN);
}
export const saveAccessToken = (token: string) => {
    localStorage.setItem(UNECE_COTTON_ACCESS_TOKEN, token);
}
export const deleteAccessToken = () => {
    localStorage.removeItem(UNECE_COTTON_ACCESS_TOKEN);
}

function my_pre(context: any): Promise<void> {
    const accessToken = localStorage.getItem(UNECE_COTTON_ACCESS_TOKEN);
    if(accessToken){
        context.init.headers['Authorization'] = 'Bearer '+accessToken;
    }
    return Promise.resolve();
}

function my_post(context: any): Promise<void> {
    return Promise.resolve();
}

export const backendUrl = process.env.REACT_APP_BACKEND_URL && process.env.REACT_APP_BACKEND_URL!=='sh'
    ? process.env.REACT_APP_BACKEND_URL
    : 'http://localhost:8080/api';
const configuration = new Configuration({
    basePath: backendUrl,
    middleware: [{
        pre: my_pre,
        post:my_post
    }]
});

export default configuration;
