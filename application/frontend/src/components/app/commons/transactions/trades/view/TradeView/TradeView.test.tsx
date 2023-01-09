import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Form} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {
    ConfirmationCertificationPresentable,
    ConfirmationCertificationPresentableSubjectEnum,
    ConfirmationTradePresentable,
} from "@unece/cotton-fetch";
import {useHistory, useLocation} from "react-router-dom";
import {FaDownload} from "react-icons/fa";
// @ts-ignore
import Select from 'react-select';
import {Viewer} from '@react-pdf-viewer/core';
import {downloadFile} from "../../../../../../../utils/downloadFile";
import TW, {TradeView} from "./TradeView";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {useForm} from "react-hook-form";
import TradeControllerApi from "../../../../../../../api/TradeControllerApi";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

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
        useRouteMatch: jest.fn(),
        useLocation: jest.fn()
    }
});

jest.mock("../../../../../../../api/CertificationControllerApi", () => {
    return {
        getCertificationsByTransactionId: jest.fn()
    }
});

jest.mock("../../../../../../../api/TradeControllerApi", () => {
    return {
        getTradeProcessingStandards: jest.fn(),
        updateTrade: jest.fn()
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

jest.mock("react-icons/ai", () => {
    return {
        AiFillEdit: jest.fn().mockImplementation(({children}) => <div className={'AiFillEdit'}>{children}</div>),
    }
});

jest.mock('react-hook-form', () => {
    return {
        useForm: jest.fn(),
    }
});

jest.mock("../../../../../../../utils/downloadFile", () => {
    return {
        downloadFile: jest.fn()
    }
});

jest.mock("react-select", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Select'}>{children}</div>)
});

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let Jumbotron = jest.fn().mockImplementation(({children}) => <div className={'Jumbotron'}>{children}</div>);

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

    return {
        Button,
        Form,
        Jumbotron
    };
});



describe('Trade confirmation test', () => {
    const MockedButton = mocked(Button, true);
    const MockedFaDownload = mocked(FaDownload, true);
    const MockedCertificationControllerApi = mocked(CertificationControllerApi, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedDownloadFile = mocked(downloadFile, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedViewer = mocked(Viewer, true);
    const MockedUseLocation = mocked(useLocation, true);
    const companyIndustrialSector = "sectorTest";
    const MockedSelect = mocked(Select, true);
    const MockedUseForm = mocked(useForm, true);
    const MockedTradeControllerApi = mocked(TradeControllerApi, true);

    const mockedHandleSubmit = jest.fn();

    // @ts-ignore
    MockedUseForm.mockReturnValue({
        handleSubmit: mockedHandleSubmit,
    });

    // @ts-ignore
    MockedUseLocation.mockReturnValue({
        state: { from: { pathname: "/previous_path" } },
        pathname: "/actual_path"
    });

    const addSuccessMessage = jest.fn();
    const addErrorMessage = jest.fn();
    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const userLoggedIn = {
        company: {companyName: "companyTest"}
    };
    // @ts-ignore
    const uneceCottonTracking : UneceCottonTracking = {};

    const trade : ConfirmationTradePresentable = {
        contractorReferenceNumber: "1234",
        contractorName: "company1",
        consigneeName: "company2",
        approverName: "company2",
        document: {
            content: "content pdf",
            fileName: "test_file.pdf",
            contentType: "application/pdf"
        },
        positions: [{quantity: 5, unit: "kg", weight: 100, externalDescription: "description", contractorMaterialId: 1}],
        processingStandardName: "ref standard 1"
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <Provider store={store}>
                <TW trade={trade} />
            </Provider>
        );
        mount(
            <TradeView
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );
    });
    it('Render without crashing async', async () => {
        await act(async () => {
            await mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

    });

    it('Content test', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("contract");

        let component : any = null;
        await act(async () => {
            component = await mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(component.find(".FormGroup").length).toEqual(19);
        expect(component.find(".FormLabel").length).toEqual(18);
        expect(MockedFormGroup).toHaveBeenCalledTimes(38);
        expect(MockedFormLabel).toHaveBeenCalledTimes(36);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(19, {children: "trade.contractor"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(20, {children: "trade.contractor_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(21, {children: "trade.consignee"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(22, {children: "trade.consignee_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(23, {children: "trade.document"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(24, {children: "reference_standard"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(25, {children: "notes"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(26, {children: "certificates"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(27, {children: "valid_from"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(28, {children: "valid_until"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(29, {children: "trade.consignee_id"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(30, {children: "trade.contractor_id"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(31, {children: "trade.consignee_material"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(32, {children: "trade.contractor_material"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(33, {children: "positions.quantity"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(34, {children: "positions.unit"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(35, {children: "positions.weight"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(36, {children: "positions.material_description"}, {});

        expect(component.find(".Button").length).toEqual(1);
        expect(MockedButton).toHaveBeenCalledTimes(2);
        expect(MockedButton).toHaveBeenNthCalledWith(2,
            {
                children: "show_chain",
                className: "ShowSupplyChainBtn",
                onClick: expect.any(Function),
                variant: "primary"
            }, {});

    });

    it('Document preview - generic', async () => {
        let component: any = null;
        await act(async () => {
            component = await mount(<TradeView
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(component.find(".Viewer").length).toEqual(1);
        expect(MockedViewer).toHaveBeenCalledTimes(2);
        expect(MockedViewer).toHaveBeenNthCalledWith(2, {
            fileUrl: "data:application/pdf;base64," + trade.document?.content
        }, {});


        // test preview of image with .jpeg or .png format
        // @ts-ignore
        trade.document.fileName = "image.png";
        // @ts-ignore
        trade.document.contentType = "image/png";
        MockedViewer.mockClear();
        await act(async () => {
            component = await mount(<TradeView
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        component.update();
        expect(MockedViewer).not.toHaveBeenCalled();
        expect(component.find('img').length).toEqual(1);
        expect(component.find('img').prop('src')).toEqual("data:image/png;base64, " + trade.document?.content);
    });

    it('Document download', async () => {
        let component;
        await act(async () => {
            component = await mount(<TradeView
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
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

    it('getTradeCertificates failed on first render', async () => {
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockImplementation(() => Promise.reject("Generic error"));

        await act(async () => {
            mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.certificates: Generic error");

    });

    it('retrieveInformationToUpdate', async () => {
        const referencedStandards = [{name: "ref1"}, {name: "ref2"}];

        MockedTradeControllerApi.getTradeProcessingStandards.mockReturnValue(Promise.resolve(referencedStandards));

        let component : any = null;
        await act(async () => {
            component = mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn}
                />
            );
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        expect(startLoading).toHaveBeenCalledTimes(1);
        expect(stopLoading).toHaveBeenCalledTimes(1);
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });
        expect(startLoading).toHaveBeenCalledTimes(2);
        expect(startLoading).toHaveBeenNthCalledWith(2, "popups.loading.trade_update");
        expect(MockedTradeControllerApi.getTradeProcessingStandards).toHaveBeenCalledTimes(1);
        expect(stopLoading).toHaveBeenCalledTimes(2);
        expect(MockedSelect).toHaveBeenCalledTimes(3);

        expect(MockedSelect).toHaveBeenNthCalledWith(3, {
            isClearable: true,
            value: {value: {name: trade.processingStandardName}, label: trade.processingStandardName},
            onChange: expect.any(Function),
            options: referencedStandards.map(ps => ({value: ps, label: ps.name}))
        }, {});

        // back button pressed
        component.update();
        expect(component.find('.AiFillEdit').length).toEqual(0);
        expect(MockedButton).toHaveBeenCalledTimes(11);
        expect(MockedButton).toHaveBeenNthCalledWith(10, {
            variant: "primary",
            className: "mr-2 bg-danger border-danger",
            onClick: expect.any(Function),
            children: "cancel"
        }, {});
        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[9][0].onClick();
        });
        component.update();
        expect(component.find('.AiFillEdit').length).toEqual(1);

    });

    it('handleUpdate test', async () => {
        const tradeType = "contract";
        const historyPush = jest.fn();

        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue(tradeType);

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: historyPush
        });

        let component : any = null;

        MockedTradeControllerApi.updateTrade.mockReturnValue(Promise.resolve());
        await act(async () => {
            component = mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn}
                />
            );
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });

        expect(MockedSelect).toHaveBeenCalledTimes(3);
        act(() => {
           MockedSelect.mock.calls[2][0].onChange({value: {name: "ref standard 2"}});
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(6);
        expect(addSuccessMessage).not.toHaveBeenCalled();
        await act(async () => {
            mockedHandleSubmit.mock.calls[5][0]({})
        });

        expect(MockedTradeControllerApi.updateTrade).toHaveBeenCalledTimes(1);
        expect(MockedTradeControllerApi.updateTrade).toHaveBeenNthCalledWith(1, {
            updateTradeRequest: {
                processingStandardName: "ref standard 2",
                tradeType: tradeType
            },
            id: undefined
        });

        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "popups.success.trade_update");
        expect(historyPush).toHaveBeenCalledTimes(1);
        expect(historyPush).toHaveBeenNthCalledWith(1, '/');
    });

    it('handleUpdate test failed', async () => {
        let component : any = null;

        MockedTradeControllerApi.updateTrade.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            component = mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn}
                />
            );
        });

        expect(component.find('h4').at(0).text()).toEqual("edit");
        await act(async () => {
            component.find("h4").at(0).simulate("click");
        });

        expect(mockedHandleSubmit).toHaveBeenCalledTimes(5);
        expect(addErrorMessage).toHaveBeenCalledTimes(1)
        await act(async () => {
            mockedHandleSubmit.mock.calls[4][0]({})
        });

        expect(addErrorMessage).toHaveBeenCalledTimes(2);
        expect(addErrorMessage).toHaveBeenNthCalledWith(2, "popups.errors.trade_update: Generic error");
    });

    it('Show supply chain test', async () => {
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        let component : any = null;
        await act(async () => {
            component = mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} 
                />
            );
        });

        expect(component.find('.Button').length).toEqual(1);
        expect(MockedButton).toHaveBeenCalledTimes(2);
        expect(MockedButton.mock.calls[1][0].children).toEqual("show_chain");
        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });

        expect(pushMock).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/graph/' + trade.positions[0].contractorMaterialId);

    });

    it('Certificates area test', async () => {
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        const certificates : ConfirmationCertificationPresentable[] = [
            {id: 1, processingStandardName: "procStandard 1", subject: ConfirmationCertificationPresentableSubjectEnum.Material},
            {id: 2, processingStandardName: "procStandard 2", subject: ConfirmationCertificationPresentableSubjectEnum.Self}
        ];
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve(certificates));

        let component : any = null;
        await act(async () => {
            component = mount(
                <TradeView
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} 
                />
            );
        });

        expect(component.find('.Button').length).toEqual(1);
        expect(MockedButton).toHaveBeenCalledTimes(5);
        expect(MockedButton).toHaveBeenNthCalledWith(3, {
            className: "CertificateButton",
            variant: "primary",
            onClick: expect.any(Function),
            children: ["show_certificate", " ", 0, " ", "- " + certificates[0].processingStandardName]
        }, {});
        expect(MockedButton).toHaveBeenNthCalledWith(4, {
            className: "CertificateButton",
            variant: "primary",
            onClick: expect.any(Function),
            children: ["show_certificate", " ", 1, " ", "- " + certificates[1].processingStandardName]
        }, {});

        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[3][0].onClick();
        });

        expect(pushMock).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(pushMock).toHaveBeenNthCalledWith(1, '/' + companyIndustrialSector + '/certifications/' + certificates[1].subject.toLowerCase() + "/" + certificates[1].id + '/confirmation');
    });
    
});


