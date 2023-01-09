import {request} from "../api/utilRequest";
import {backendUrl} from "../api/utils";

export const downloadFile = async (path: string, filename: string, errorMessage: () => void) => {
    try{
        const response = await request({
            url: backendUrl + path,
            method: 'GET',
            responseType: 'blob'
        }, undefined);
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    } catch(error){
        errorMessage();
    }
}
export const getFileExtension = (filename: string) =>
{
    const ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
}