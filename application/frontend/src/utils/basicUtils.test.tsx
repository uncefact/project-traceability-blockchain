import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {
    getBase64,
    isSameOrAfterOrNotSet, isValidEmail,
    isValidFromDate, isValidURL,
    moveElementFirstByFieldValue,
    upperCaseFirstLetter
} from "./basicUtils";

Enzyme.configure({ adapter: new Adapter() });

const mockFile = ({ name = 'file.pdf', size = 1024, type = 'application/pdf' }) => {
    const blob = new Blob(['a'.repeat(size)], { type });

    return new File([blob], name);
};

describe('basicUtils test', () => {

   it('getBase64 test', async () => {
       const backupFileReader = Object.assign({}, window.FileReader);
       const obj = {
           readAsDataURL: jest.fn(),
           result: 'resultTest',
           onload: null,
           onerror: null
       };
       const setPropertyMockFunction = jest.fn().mockImplementation(fn => fn());
       const setError = jest.fn();

       Object.defineProperty(obj, 'onload', {
           set: setPropertyMockFunction
       });
       Object.defineProperty(obj, 'onerror', {
           set: setError
       });

       const myFileReader = jest.fn().mockImplementation(() => obj);

       // @ts-ignore
       window.FileReader = myFileReader;
       const file = mockFile({
           name: 'test.pdf'
       });
       const result = await getBase64(file);

       expect(obj.readAsDataURL).toHaveBeenCalledTimes(1);
       expect(obj.readAsDataURL).toHaveBeenNthCalledWith(1, file);
       expect(setPropertyMockFunction).toHaveBeenCalledTimes(1);
       expect(setError).toHaveBeenCalledTimes(1);
       expect(result).toEqual("resultTest==");
       window.FileReader = Object.assign({}, backupFileReader);
   });
    it('isValidFromDate test', async () => {
     //   @ts-ignore
        Date.now = jest.fn(() => new Date("2021-03-17T12:00:00.000Z"));
        expect(isValidFromDate(new Date("2021-03-18T12:00:00.000Z"))).toBeTruthy();
        expect(isValidFromDate(new Date("2021-03-17T11:00:00.000Z"))).toBeTruthy();
        expect(isValidFromDate(new Date("2021-03-16T12:00:00.000Z"))).toBeFalsy();
    });
    it('isSameOrAfterOrNotSet test', async () => {
        expect(isSameOrAfterOrNotSet(
            new Date("2021-03-19T12:00:00.000Z"),
            new Date("2021-03-18T12:00:00.000Z"),
        )).toBeTruthy();
        expect(isSameOrAfterOrNotSet(
            new Date("2021-03-18T12:00:00.000Z"),
            new Date("2021-03-19T12:00:00.000Z"),
        )).toBeFalsy();
        expect(isSameOrAfterOrNotSet(
            null,
            new Date("2021-03-19T12:00:00.000Z"),
        )).toBeTruthy();
    });
    it('upperCaseFirstLetter test', () => {
        expect(upperCaseFirstLetter("Test")).toEqual("Test");
        expect(upperCaseFirstLetter("test")).toEqual("Test");
        expect(upperCaseFirstLetter(null)).toEqual("");
    });
    it('moveElementFirstByFieldValue', () => {
       const genericList = [{ code: "el1", name: "element 1" }, { code: "el2", name: "element 2" }, { code: "el3", name: "element 3"}];
       const genericListEl3First = moveElementFirstByFieldValue(genericList, "code", "el3");
       expect(genericListEl3First[0]).toEqual({code: "el3", name: "element 3"});
       expect(genericListEl3First[1]).toEqual({code: "el1", name: "element 1"});
       expect(genericListEl3First[2]).toEqual({code: "el2", name: "element 2"});
    });
    it('isValidURL test', () => {
       const correctUrl = "https://www.test.ch";
       const wrongURL = "www.test.ch";
       expect(isValidURL(correctUrl)).toBeTruthy();
       expect(isValidURL(wrongURL)).toBeFalsy();
    });
    it('isValidEmail test', () => {
        const correctEmail = "test@mail.ch";
        const wrongEmails = ["test@ch", "test@mail.", "@mail.ch", "testmail.com"];
        expect(isValidEmail(correctEmail)).toBeTruthy();
        for (let i=0; i<wrongEmails.length; i++)
            expect(isValidEmail(wrongEmails[i])).toBeFalsy();
    })
});
