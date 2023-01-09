import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {request} from "../api/utilRequest";
import {downloadFile, getFileExtension} from "./downloadFile";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("../api/utilRequest", () => {
    return {
        request: jest.fn()
    }
});

describe('downloadFile test', () => {
    const MockedRequest = mocked(request, true);

    it('downloadFile test', async () => {
        // @ts-ignore
        const link : HTMLLinkElement = {
            click: jest.fn(),
            setAttribute: jest.fn()
        };
        document.createElement = jest.fn().mockReturnValue(link);
        document.body.appendChild = jest.fn();
        window.URL.createObjectURL = jest.fn();
        MockedRequest.mockReturnValue(Promise.resolve("responseTest"));

        await downloadFile("/test/download", "file.pdf", jest.fn());
        expect(window.URL.createObjectURL).toHaveBeenCalledWith('responseTest');
        expect(document.createElement).toHaveBeenCalledWith('a');
    });

    it('downloadFile test - failed', async () => {
        // @ts-ignore
        const link : HTMLLinkElement = {
            click: jest.fn(),
            setAttribute: jest.fn()
        };
        const errorFunction = jest.fn();
        document.createElement = jest.fn().mockReturnValue(link);
        document.body.appendChild = jest.fn();
        window.URL.createObjectURL = jest.fn();
        MockedRequest.mockReturnValue(Promise.reject("Generic error"));

        await downloadFile("/test/download", "file.pdf", errorFunction);
        expect(errorFunction).toHaveBeenCalledTimes(1);
    });

    it('getFileExtension test', () => {
       const filename = "test_file.pdf";
       let extension = getFileExtension(filename);
       expect(extension).toEqual("pdf");
    });

});