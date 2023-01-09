import React from "react";
import {Form,InputGroup} from "react-bootstrap";
import {mocked} from "ts-jest/utils";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {act} from "react-dom/test-utils";
import {getBase64} from "../../../../../../../utils/basicUtils";
import {CertificationAttachment} from "./CertificationAttachment";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock("../../../../../../../utils/basicUtils", () => {
    return ({
        getBase64: jest.fn(),
    });
});

jest.mock("react-bootstrap", () => {
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let InputGroup = jest.fn().mockImplementation(({children}) => <div className={'InputGroup'}>{children}</div>);

    // @ts-ignore
    Form.Control = jest.fn().mockImplementation(({children}) => <div className={'FormControl'}>{children}</div>);
    // @ts-ignore
    Form.Text = jest.fn().mockImplementation(({children}) => <div className={'FormText'}>{children}</div>);
    // @ts-ignore
    InputGroup.Text = jest.fn().mockImplementation(({children}) => <div className={'FormText'}>{children}</div>);
    // @ts-ignore
    Form.File = jest.fn().mockImplementation(({children}) => <div className={'FormFile'}>{children}</div>);

   return {
       Form,
       InputGroup
   }
});

describe('CertificationAttachment test', () => {
    const MockedFormFile = mocked(Form.File, true);
    const MockedFormText = mocked(Form.Text, true);
    const MockedInputGroupText = mocked(InputGroup.Text, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedGetBase64 = mocked(getBase64, true);

    const register = jest.fn();
    const fileUploaded = {name: "testFile"}
    const setFileUploaded = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('Render without crashing', async () => {
        mount(
            <CertificationAttachment
                register={register}
                fileUploaded={fileUploaded}
                setFileUploaded={setFileUploaded}
            />
        );
    });

    it('Content test - Upload document file', () => {
        mount(
            <CertificationAttachment
                register={register}
                fileUploaded={fileUploaded}
                setFileUploaded={setFileUploaded}
            />
        );

        expect(MockedFormFile).toHaveBeenCalledTimes(1);
        expect(MockedFormFile).toHaveBeenNthCalledWith(1, {
            type: "file",
            name: "documentUpload",
            label: fileUploaded.name,
            onChange: expect.any(Function),
            custom: true
        }, {});
        expect(MockedFormText).toHaveBeenCalledTimes(2);
        expect(MockedFormText).toHaveBeenNthCalledWith(1, {
           children: "max_upload",
           className: "text-muted"
        }, {});
        expect(MockedFormText).toHaveBeenNthCalledWith(2, {
            children: "certification.switch_to_link"
        }, {});
    });

    it('Content test - Upload file from URL', () => {
        mount(
            <CertificationAttachment
                register={register}
                fileUploaded={fileUploaded}
                setFileUploaded={setFileUploaded}
            />
        );

        expect(MockedFormText).toHaveBeenCalledTimes(2);
        act(() => {
           MockedInputGroupText.mock.calls[0][0].onClick();
        });

        expect(MockedFormControl).toHaveBeenCalledTimes(1);
        expect(MockedFormControl).toHaveBeenNthCalledWith(1, {
            type: "text",
            name: "certificatePageUrl",
            placeholder: "placeholders.certification.document_url"
        }, {});
        expect(MockedFormText).toHaveBeenCalledTimes(3);
        expect(MockedFormText).toHaveBeenNthCalledWith(3, {
            children: "certification.switch_to_document"
        }, {});
    });

    it('Upload document file - handleDocumentUpload()', async () => {
        mount(
            <CertificationAttachment
                register={register}
                fileUploaded={fileUploaded}
                setFileUploaded={setFileUploaded}
            />
        );

        expect(MockedFormFile.mock.calls[0][0].label).toEqual(fileUploaded.name);
        expect(setFileUploaded).not.toHaveBeenCalled();
        MockedGetBase64.mockReturnValue(Promise.resolve("test content"));
        await act(async () => {
            MockedFormFile.mock.calls[0][0].onChange({
                target: {
                    files: [new File([new Blob(['a'.repeat(100)], {type:'application/pdf'})], "testfile.pdf")]
                }
            });
        });

        expect(setFileUploaded).toHaveBeenCalledTimes(1);
    });

    it('Upload file from url - graphical behaviour', async () => {
        mount(
            <CertificationAttachment
                register={register}
                fileUploaded={fileUploaded}
                setFileUploaded={setFileUploaded}
            />
        );

        expect(MockedFormText).toHaveBeenCalledTimes(2);
        act(() => {
            MockedInputGroupText.mock.calls[0][0].onClick();
        });
        expect(MockedFormText).toHaveBeenNthCalledWith(3, {
            children: 'certification.switch_to_document'
        }, {});
        expect(MockedFormControl.mock.calls[0][0].value).toEqual(undefined);
        expect(setFileUploaded).toHaveBeenCalledTimes(1);
        expect(setFileUploaded).toHaveBeenNthCalledWith(1, {name: "upload_document"});

        // click again on text to swap the kind of document upload
        act(() => {
            MockedInputGroupText.mock.calls[1][0].onClick();
        });
        expect(MockedFormText).toHaveBeenNthCalledWith(5, {
            children: 'certification.switch_to_link'
        }, {});

        // then the useForm will fill the certificatePageUrl field of the request
    });
});