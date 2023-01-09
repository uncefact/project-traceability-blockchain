import moxios from 'moxios';
import {getAccessToken} from "./utils";
import {mocked} from "ts-jest/utils";
import {request} from './utilRequest';

jest.mock("./utils", () => {
   return {
      getAccessToken: jest.fn()
   }
});


describe("HTTP mediator tests", () => {
   const MockedGetAccessToken = mocked(getAccessToken, true);

   beforeEach(() => {
      moxios.install();
   });

   afterEach(() => {
      moxios.uninstall();
   });

   it('useless', function () {
      expect(true).toBeTruthy();
   });

   it('request method test without access token', async () => {
      let req;
      MockedGetAccessToken.mockReturnValue(null);
      moxios.wait(() => {
         req = moxios.requests.mostRecent();
         expect(req.headers.Authorization).not.toBeDefined();
         req.respondWith({status: 200, response: 'test'});
      });

      let result = await request({
         url: '/url/test',
         method: 'GET'
      }, 'application/json', null);
      expect(result).toEqual("test");


   });

   it('request method test with access token', async () => {
      let req;
      MockedGetAccessToken.mockReturnValue("TEST_TOKEN");
      moxios.wait(() => {
         req = moxios.requests.mostRecent();
         expect(req.headers.Authorization).toBeDefined();
         req.respondWith({status: 200, response: 'test'});
      });

      // @ts-ignore
      let result = await request({
         url: '/url/test',
         method: 'GET'
      });
      expect(result).toEqual("test");
   });

});