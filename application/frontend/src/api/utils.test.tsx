import {deleteAccessToken, getAccessToken, saveAccessToken} from "./utils";
import Configuration from './utils';

describe('Utils tests', () => {
    it('getAccessToken test', () => {
        jest.spyOn(window.localStorage.__proto__, 'getItem');
        window.localStorage.__proto__.getItem = jest.fn().mockReturnValue('test');
        const ret = getAccessToken();
        expect(ret).toEqual('test');
        expect(localStorage.getItem).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem).toHaveBeenNthCalledWith(1, 'UNECE_COTTON_ACCESS_TOKEN');
    });
    it('saveAccessToken test', () => {
        jest.spyOn(window.localStorage.__proto__, 'setItem');
        window.localStorage.__proto__.setItem = jest.fn();
        saveAccessToken('accessTokenTest');
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenNthCalledWith(1, 'UNECE_COTTON_ACCESS_TOKEN', 'accessTokenTest');
    });
    it('deleteAccessToken test', () => {
        jest.spyOn(window.localStorage.__proto__, 'removeItem');
        window.localStorage.__proto__.removeItem = jest.fn();
        deleteAccessToken();
        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
        expect(localStorage.removeItem).toHaveBeenNthCalledWith(1, 'UNECE_COTTON_ACCESS_TOKEN');
    });
    it('my_pre test', async () => {
        expect(Configuration.middleware).toHaveLength(1);
        expect(Object.keys(Configuration.middleware[0])).toHaveLength(2);

        jest.spyOn(window.localStorage.__proto__, 'getItem');
        window.localStorage.__proto__.getItem = jest.fn().mockReturnValue('accessTokenTest');
        let context = {
            fetch: ()=>new Promise<Response>(resolve => null),
            url: '',
            init: {
                headers: {
                    Authorization: ''
                }
            }
        };
        if(Configuration.middleware[0].pre) {
            await Configuration.middleware[0].pre(context);
            expect(context?.init?.headers?.['Authorization']).toEqual('Bearer accessTokenTest');
        } else {
            fail();
        }
    });
    it('my_post test', async () => {
        expect(Configuration.middleware).toHaveLength(1);
        expect(Object.keys(Configuration.middleware[0])).toHaveLength(2);

        if(Configuration.middleware[0].post) {
            // @ts-ignore
            await Configuration.middleware[0].post(null);
        } else {
            fail();
        }
    });
});
