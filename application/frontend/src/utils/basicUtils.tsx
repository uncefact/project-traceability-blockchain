import moment from "moment";
import {useLocation} from "react-router-dom";
import {useMemo} from "react";

export const getBase64 = (file: File) => {
    return new Promise(((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // @ts-ignore
            let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
            if ((encoded.length % 4) > 0) {
                encoded += '='.repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
        };
        reader.onerror = reject;
    }));
};
export const isValidFromDate = (date: Date) => {
    return moment(date).startOf('day').isSameOrAfter(moment().startOf('day'));
}
export const isSameOrAfterOrNotSet = (date1: Date | null, date2: Date | undefined) => {
    return date1 === null ? true : moment(date1).isSameOrAfter(date2);
}

export const upperCaseFirstLetter = (text: string | null) => {
    return text != null ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export const moveElementFirstByFieldValue = (elementList: any, fieldName: string, fieldValue: string) => {
    elementList.sort((x: any, y: any)=>{ return x[fieldName] === fieldValue ? -1 : y[fieldName] === fieldValue ? 1 : 0; });
    return elementList;
}

export const isValidURL = (url: string | undefined) => {
    const validationRegex = new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)');
    if (url && url.match(validationRegex))
        return true;

    return false;
}

export const isValidEmail = (emailAddress: string) => {
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return emailRegex.test(emailAddress);
}


// @ts-ignore
export const asyncPipe = (...fns) => x =>
    fns.reduce(async (y, f) => f(await y), x);


// A custom hook that builds on useLocation to parse
// the query string for you.
export const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}