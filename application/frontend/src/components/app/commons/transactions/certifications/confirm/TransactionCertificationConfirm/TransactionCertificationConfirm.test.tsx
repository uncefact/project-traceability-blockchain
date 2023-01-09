import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Form, ListGroup} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import TransactionControllerApi from "../../../../../../../api/TransactionControllerApi";
import {
    ConfirmationCertificationPresentable,
} from "@unece/cotton-fetch";
import {useHistory} from "react-router-dom";
import {FaDownload} from "react-icons/fa";
// @ts-ignore
import Select from 'react-select';
import {Viewer} from '@react-pdf-viewer/core';
import {downloadFile} from "../../../../../../../utils/downloadFile";
import {TransactionCertificationConfirm} from "./TransactionCertificationConfirm";

Enzyme.configure({ adapter: new Adapter() });

// in questo modo preservo "initReactI18next" nel modulo che viene mockato perchè "initReactI18next" serve nella configurazione di i18n nel file config.ts
jest.mock("react-i18next", () => {
    return {
        // @ts-ignore
        ...jest.requireActual("react-i18next"),
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-hook-form', () => {
    return {
        useForm: jest.fn(),
    }
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(),
        useRouteMatch: jest.fn()
    }
});

jest.mock("../../../../../../../api/TransactionControllerApi", () => {
    return {
        confirmTransaction: jest.fn()
    }
});

jest.mock('@react-pdf-viewer/core', () => {
    return {
        Viewer: jest.fn().mockImplementation(({children}) => <div className={'Viewer'}>{children}</div>)
    }
});


jest.mock("react-icons/fa", () => {
    return {
        FaDownload: jest.fn().mockImplementation(({children}) => <div className={'FaDownload'}>{children}</div>)
    }
});

jest.mock("../../../../../../../utils/downloadFile", () => {
    return {
        downloadFile: jest.fn()
    }
});

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let Jumbotron = jest.fn().mockImplementation(({children}) => <div className={'Jumbotron'}>{children}</div>);
    let ListGroup = jest.fn().mockImplementation(({children}) => <div className={'ListGroup'}>{children}</div>);

    // @ts-ignore
    Form.Group = jest.fn().mockImplementation(({children}) => <div className={'FormGroup'}>{children}</div>);
    // @ts-ignore
    Form.Label = jest.fn().mockImplementation(({children}) => <div className={'FormLabel'}>{children}</div>);
    // @ts-ignore
    Form.Control = jest.fn().mockImplementation(({children}) => <div className={'FormControl'}>{children}</div>);
    // @ts-ignore
    Form.Text = jest.fn().mockImplementation(({children}) => <div className={'FormText'}>{children}</div>);
    // @ts-ignore
    Form.File = jest.fn().mockImplementation(({children}) => <div className={'FormFile'}>{children}</div>);

    // @ts-ignore
    ListGroup.Item = jest.fn().mockImplementation(({children}) => <div className={'ListGroupItem'}>{children}</div>);

    return {
        Button,
        Form,
        Jumbotron,
        ListGroup
    };
});



describe('Transaction certification confirmation test', () => {
    // @ts-ignore
    const MockedButton = mocked(Button, true);
    const MockedFaDownload = mocked(FaDownload, true);
    const MockedTransactionControllerApi = mocked(TransactionControllerApi, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedDownloadFile = mocked(downloadFile, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedViewer = mocked(Viewer, true);
    const MockedListGroup = mocked(ListGroup, true);
    const MockedListGroupItem = mocked(ListGroup.Item, true);

    const blockchainVerification = jest.fn();
    const certification: ConfirmationCertificationPresentable = {
        certificateReferenceNumber: "1234",
        document: {
            content: "content pdf",
            fileName: "test_file.pdf",
            contentType: "application/pdf"
        },
        shippingReferenceNumbers: ['shipRef1', 'shipRef2']
    };
    const documentBlockchainVerified : boolean = false;

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <TransactionCertificationConfirm
                blockchainVerification={blockchainVerification}
                certification={certification}
                documentBlockchainVerified={documentBlockchainVerified}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>
        );
    });
    it('Render without crashing async', async () => {
        await act(async () => {
            await mount(
                <TransactionCertificationConfirm
                    blockchainVerification={blockchainVerification}
                    certification={certification}
                    documentBlockchainVerified={documentBlockchainVerified}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>
            );
        });
        expect(blockchainVerification).toHaveBeenCalledTimes(1);
    });

    it('Content test', async () => {
        await act(async () => {
            await mount(
                <TransactionCertificationConfirm
                    blockchainVerification={blockchainVerification}
                    certification={certification}
                    documentBlockchainVerified={documentBlockchainVerified}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>
            );
        });

        expect(MockedFormGroup).toHaveBeenCalledTimes(12);
        expect(MockedFormLabel).toHaveBeenCalledTimes(11);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(1, {children: "certification.verifier"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(2, {children: "certification.verifier_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(3, {children: "company"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(4, {children: "certification.company_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(5, {children: "document_type"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(6, {children: "reference_standard"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(7, {children: "notes"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(8, {children: "assessment_type"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(9, {children: "certification.shipments_ref"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(10, {children: "issue_date"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(11, {children: "certification.report_id"}, {});

        expect(MockedListGroup).toHaveBeenCalledTimes(1);
        expect(MockedListGroupItem).toHaveBeenCalledTimes(2);
        expect(MockedListGroupItem).toHaveBeenNthCalledWith(1, {
            // @ts-ignore
            children: certification.shippingReferenceNumbers[0],
            className: "List",
            disabled: true
        }, {});
        expect(MockedListGroupItem).toHaveBeenNthCalledWith(2, {
            // @ts-ignore
            children: certification.shippingReferenceNumbers[1],
            className: "List",
            disabled: true
        }, {});

        expect(MockedButton).toHaveBeenCalledTimes(2);
        expect(MockedButton).toHaveBeenNthCalledWith(1, {
            children: "refuse",
            className: "mr-2 bg-danger border-danger",
            onClick: expect.any(Function),
            variant: "primary"
        }, {});
        expect(MockedButton).toHaveBeenNthCalledWith(2, {
            children: "confirm",
            onClick: expect.any(Function),
            variant: "primary"
        }, {});
    });

    it('Document preview - generic', async () => {
        let component: any = null;
        await act(async () => {
            component = await mount(<TransactionCertificationConfirm
                blockchainVerification={blockchainVerification}
                certification={certification}
                documentBlockchainVerified={documentBlockchainVerified}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>);
        });

        expect(MockedViewer).toHaveBeenCalledTimes(1);
        expect(MockedViewer).toHaveBeenNthCalledWith(1, {
            fileUrl: "data:application/pdf;base64," + certification.document?.content
        }, {});


        // test preview of image with .jpeg or .png format
        // @ts-ignore
        certification.document.fileName = "image.png";
        // @ts-ignore
        certification.document.contentType = "image/png";
        MockedViewer.mockClear();
        await act(async () => {
            component = await mount(<TransactionCertificationConfirm
                blockchainVerification={blockchainVerification}
                certification={certification}
                documentBlockchainVerified={documentBlockchainVerified}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>);
        });

        component.update();
        expect(MockedViewer).not.toHaveBeenCalled();
        expect(component.find('img').length).toEqual(1);
        expect(component.find('img').prop('src')).toEqual("data:image/png;base64, " + certification.document?.content);
    });

    it('Document download', async () => {
        let component;
        await act(async () => {
            component = await mount(<TransactionCertificationConfirm
                blockchainVerification={blockchainVerification}
                certification={certification}
                documentBlockchainVerified={documentBlockchainVerified}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>
            );
        });

        // @ts-ignore
        component.update();
        // @ts-ignore
        expect(component.find('.FaDownload').length).toEqual(1);

        MockedDownloadFile.mockImplementation(jest.fn());
        await act(async () => {
            // @ts-ignore
            MockedFaDownload.mock.calls[0][0].onClick();
        });
        expect(MockedDownloadFile).toHaveBeenCalledTimes(1);
    });

    it('handleConfirmation success', async () => {
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedTransactionControllerApi.confirmTransaction.mockReturnValue(Promise.resolve("Test success"));
        await act(async () => {
            await mount(
                <TransactionCertificationConfirm
                    blockchainVerification={blockchainVerification}
                    certification={certification}
                    documentBlockchainVerified={documentBlockchainVerified}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>
            );
        });

        expect(MockedButton.mock.calls[1][0].children).toEqual("confirm");
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.transaction_cert_add");
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/');
    });

    it('handleConfirmation failed', async () => {
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedTransactionControllerApi.confirmTransaction.mockImplementation(() => Promise.reject("Error"));
        await act(async () => {
            await mount(
                <TransactionCertificationConfirm
                    blockchainVerification={blockchainVerification}
                    certification={certification}
                    documentBlockchainVerified={documentBlockchainVerified}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}/>
            );
        });

        expect(MockedButton.mock.calls[0][0].children).toEqual("refuse");
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[0][0].onClick();
        });

        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.certification_update: Generic error");
        expect(pushMock).not.toHaveBeenCalled();
    });
});


