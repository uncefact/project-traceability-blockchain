import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {mocked} from "ts-jest/utils";
import {Button, Form} from "react-bootstrap";
import {act} from "react-dom/test-utils";
import TransactionControllerApi from "../../../../../../../api/TransactionControllerApi";
import MaterialControllerApi from "../../../../../../../api/MaterialControllerApi";
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
import {TradeConfirm} from "./TradeConfirm";
import {GenericDropdownSelector} from "../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector";

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
        useRouteMatch: jest.fn(),
        useLocation: jest.fn()
    }
});

jest.mock("../../../../../../GenericComponents/GenericDropdownSelector/GenericDropdownSelector", () => {
    return {
        GenericDropdownSelector: jest.fn().mockImplementation(({children}) => <div className={'GenericDropdownSelector'}>{children}</div>)
    }
})

jest.mock("../../../../../../../api/TransactionControllerApi", () => {
    return {
        confirmTransaction: jest.fn()
    }
});

jest.mock("../../../../../../../api/CertificationControllerApi", () => {
    return {
        getCertificationsByTransactionId: jest.fn()
    }
});

jest.mock("../../../../../../../api/MaterialControllerApi", () => {
    return {
        getMaterialsByCompany: jest.fn(),
        addMaterialFromCompany: jest.fn()
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
    const MockedGenericDropdownSelector = mocked(GenericDropdownSelector, true);
    const MockedFaDownload = mocked(FaDownload, true);
    const MockedTransactionControllerApi = mocked(TransactionControllerApi, true);
    const MockedMaterialControllerApi = mocked(MaterialControllerApi, true);
    const MockedCertificationControllerApi = mocked(CertificationControllerApi, true);
    const MockedUseHistory = mocked(useHistory, true);
    const MockedDownloadFile = mocked(downloadFile, true);
    const MockedFormGroup = mocked(Form.Group, true);
    const MockedFormLabel = mocked(Form.Label, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedViewer = mocked(Viewer, true);
    const MockedUseLocation = mocked(useLocation, true);
    const companyIndustrialSector = "sectorTest";

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
        positions: [{quantity: 5, unit: "kg", weight: 100, externalDescription: "description", contractorMaterialId: 1}]
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <TradeConfirm
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );
    });
    it('Render without crashing async', async () => {
        await act(async () => {
            await mount(
                <TradeConfirm
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
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(component.find(".FormGroup").length).toEqual(19);
        expect(component.find(".FormLabel").length).toEqual(18);
        expect(MockedFormGroup).toHaveBeenCalledTimes(95);
        expect(MockedFormLabel).toHaveBeenCalledTimes(90);
        expect(MockedFormLabel).toHaveBeenNthCalledWith(73, {children: "trade.contractor"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(74, {children: "trade.contractor_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(75, {children: "trade.consignee"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(76, {children: "trade.consignee_email"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(77, {children: "trade.document"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(78, {children: "reference_standard"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(79, {children: "notes"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(80, {children: "certificates"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(81, {children: "valid_from"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(82, {children: "valid_until"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(83, {children: "trade.consignee_id"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(84, {children: "trade.contractor_id"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(85, {children: "trade.consignee_material"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(86, {children: "trade.contractor_material"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(87, {children: "positions.quantity"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(88, {children: "positions.unit"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(89, {children: "positions.unit"}, {});
        expect(MockedFormLabel).toHaveBeenNthCalledWith(90, {children: "positions.material_description"}, {});

        expect(component.find(".Button").length).toEqual(3);
        expect(MockedButton).toHaveBeenCalledTimes(15);
        expect(MockedButton).toHaveBeenNthCalledWith(13,
            {
                children: "show_chain",
                className: "ShowSupplyChainBtn",
                onClick: expect.any(Function),
                variant: "primary"
            }, {});
        expect(MockedButton).toHaveBeenNthCalledWith(14,
            {
                children: "refuse",
                className: "mr-2 bg-danger border-danger",
                onClick: expect.any(Function),
                variant: "primary"
            }, {});
        expect(MockedButton).toHaveBeenNthCalledWith(15,
            {
                children: "confirm",
                onClick: expect.any(Function),
                variant: "primary"
            }, {});


        expect(component.find(".GenericDropdownSelector").length).toEqual(1);
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(5);
        expect(MockedGenericDropdownSelector).toHaveBeenNthCalledWith(5, {
            getItems: expect.any(Function),
            itemPropToShow: "name",
            selectItem: expect.any(Function),
            defaultText: "select_material",
            newItemFields: ["name"],
            onCreate: expect.any(Function),
            creationTitle: "material_name",
            createDisabled: expect.any(Function),
            required: true,
        }, {});
    });

    it('Content test - consignee material in position already mapped', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("contract");

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
            positions: [{contractorMaterialId: 1, consigneeMaterialId: 2, consigneeMaterialName: "Mapped material"}]
        }

        let component : any = null;
        await act(async () => {
            component = await mount(
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(MockedGenericDropdownSelector).not.toHaveBeenCalled();
        expect(MockedFormControl).toHaveBeenCalledTimes(85);
        expect(MockedFormControl).toHaveBeenNthCalledWith(80, {
            type: "text",
            value: trade.positions[0].consigneeMaterialName,
            disabled: true
        }, {});
    });

    it('Document preview - generic', async () => {
        let component: any = null;
        await act(async () => {
            component = await mount(<TradeConfirm
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(component.find(".Viewer").length).toEqual(1);
        expect(MockedViewer).toHaveBeenCalledTimes(5);
        expect(MockedViewer).toHaveBeenNthCalledWith(5, {
            fileUrl: "data:application/pdf;base64," + trade.document?.content
        }, {});


        // test preview of image with .jpeg or .png format
        // @ts-ignore
        trade.document.fileName = "image.png";
        // @ts-ignore
        trade.document.contentType = "image/png";
        MockedViewer.mockClear();
        await act(async () => {
            component = await mount(<TradeConfirm
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
            component = await mount(<TradeConfirm
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

    it('getMaterialsByCompany test failed', async () => {
        let component;
        MockedMaterialControllerApi.getMaterialsByCompany.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            component = await mount(<TradeConfirm
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.materials_from_company: Generic error");

    });

    it('addConsigneeMaterial test', async () => {
        let component;
        const materials = [
            {id: 1, name: "red wire"},
            {id: 2, name: "blue wire"},
            {id: 3, name: "green wire"},
        ];

        MockedMaterialControllerApi.getMaterialsByCompany.mockReturnValue(Promise.resolve(materials));
        await act(async () => {
            component = await mount(<TradeConfirm
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(5);
        expect(MockedGenericDropdownSelector.mock.calls[4][0].defaultText).toEqual("select_material");

        // create new Material
        MockedMaterialControllerApi.addMaterialFromCompany.mockReturnValue(Promise.resolve({ id: 1 }));
        expect(MockedGenericDropdownSelector.mock.calls[4][0].creationTitle).toEqual("material_name");
        await act(async () => {
            // @ts-ignore
            MockedGenericDropdownSelector.mock.calls[4][0].onCreate({
                name: 'Material test name'
            });
        });

        expect(MockedMaterialControllerApi.addMaterialFromCompany).toHaveBeenCalledTimes(1);

        // add material backend call fails
        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(7);
        expect(addErrorMessage).not.toHaveBeenCalled();
        MockedMaterialControllerApi.addMaterialFromCompany.mockReturnValue(Promise.reject("Generic error"));
        await act(async () => {
            await expect(MockedGenericDropdownSelector.mock.calls[6][0].onCreate({name: 'Material test name'})).rejects.toThrow("Material already exists!");
        });


        expect(MockedMaterialControllerApi.addMaterialFromCompany).toHaveBeenCalledTimes(2);
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
    });

    it ('setConsigneeMaterial test', async () => {
        let component;
        const materials = [
            {id: 1, name: "red wire"},
            {id: 2, name: "blue wire"},
            {id: 3, name: "green wire"},
        ];

        MockedMaterialControllerApi.getMaterialsByCompany.mockReturnValue(Promise.resolve(materials));
        await act(async () => {
            component = await mount(<TradeConfirm
                trade={trade} companyIndustrialSector={companyIndustrialSector}
                addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />);
        });

        expect(MockedGenericDropdownSelector).toHaveBeenCalledTimes(5);
        await act(async () => {
            // @ts-ignore
            MockedGenericDropdownSelector.mock.calls[4][0].selectItem({
                name: 'Material test name'
            });
        });

    });

    it('getContractorMaterials and getTradeCertificates failed on first render', async () => {
       MockedCertificationControllerApi.getCertificationsByTransactionId.mockImplementation(() => Promise.reject("Generic error"));
       MockedMaterialControllerApi.getMaterialsByCompany.mockImplementation(() => Promise.reject("Generic error"));

        await act(async () => {
            mount(
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(addErrorMessage).toHaveBeenCalledTimes(2);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.certificates: Generic error");
        expect(addErrorMessage).toHaveBeenNthCalledWith(2, "popups.errors.materials_from_company: Generic error");

    });

    it('handleConfirmation success', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("contract");

        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedTransactionControllerApi.confirmTransaction.mockReturnValue(Promise.resolve("Test success"));
        await act(async () => {
            await mount(
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        // change Buyer Reference ID
        expect(MockedFormControl).toHaveBeenCalledTimes(64);
        act(() => {
           // @ts-ignore
            MockedFormControl.mock.calls[57][0].onChange({target: {value: "1234"}});
        });

        expect(MockedButton.mock.calls[2][0].children).toEqual("confirm");
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[2][0].onClick();
        });
        expect(addSuccessMessage).toHaveBeenCalledTimes(1);
        expect(addSuccessMessage).toHaveBeenNthCalledWith(1, "contract: popups.success.trade_update");
        expect(pushMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenNthCalledWith(1, '/');
    });

    it('handleConfirmation failed', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("contract");
        const pushMock = jest.fn();

        // @ts-ignore
        MockedUseHistory.mockReturnValue({
            push: pushMock
        });

        MockedMaterialControllerApi.getMaterialsByCompany.mockReturnValue(Promise.resolve([]));
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve([]));
        MockedTransactionControllerApi.confirmTransaction.mockImplementation(() => Promise.reject("Error"));
        await act(async () => {
            await mount(
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(MockedButton.mock.calls[1][0].children).toEqual("refuse");
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[1][0].onClick();
        });

        expect(addSuccessMessage).not.toHaveBeenCalled();
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.trade_update: Error");
        expect(pushMock).not.toHaveBeenCalled();
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
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} 
                />
            );
        });

        expect(component.find('.Button').length).toEqual(3);
        expect(MockedButton).toHaveBeenCalledTimes(15);
        expect(MockedButton.mock.calls[12][0].children).toEqual("show_chain");
        act(() => {
            // @ts-ignore
            MockedButton.mock.calls[12][0].onClick();
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
            {id: 1, processingStandardName: "procStandard 1", subject: ConfirmationCertificationPresentableSubjectEnum.Scope},
            {id: 2, processingStandardName: "procStandard 2", subject: ConfirmationCertificationPresentableSubjectEnum.Material}
        ];
        MockedCertificationControllerApi.getCertificationsByTransactionId.mockReturnValue(Promise.resolve(certificates));

        let component : any = null;
        await act(async () => {
            component = mount(
                <TradeConfirm
                    trade={trade} companyIndustrialSector={companyIndustrialSector}
                    addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });

        expect(component.find('.Button').length).toEqual(3);
        expect(MockedButton).toHaveBeenCalledTimes(28);
        expect(MockedButton).toHaveBeenNthCalledWith(27, {
            variant: "primary",
            className: "mr-2 bg-danger border-danger",
            onClick: expect.any(Function),
            children: "refuse"
        }, {});

        act(() => {
           // @ts-ignore
            MockedButton.mock.calls[27][0].onClick();
        });
    });

    // TODO: non capisco come testare il metodo perchè lo stato con redux viene perso e quindi positionsToConfirm è sempre vuoto
    // it('isMaterialMissing() during handleConfirmation', async () => {
    //     const pushMock = jest.fn();
    //
    //     // @ts-ignore
    //     MockedUseHistory.mockReturnValue({
    //         push: pushMock
    //     });
    //
    //     MockedTransactionControllerApi.confirmTransaction.mockReturnValue(Promise.resolve("Test success"));
    //     await act(async () => {
    //         await mount(
    //             <TradeConfirm
    //                 trade={trade} companyIndustrialSector={companyIndustrialSector}
    //                 addSuccessMessage={addSuccessMessage} addErrorMessage={addErrorMessage}
    //                 startLoading={startLoading} stopLoading={stopLoading}
    //                 userLoggedIn={userLoggedIn} />
    //         );
    //     });
    //
    //
    //     expect(MockedButton.mock.calls[2][0].children).toEqual("Confirm");
    //     await act(async () => {
    //         // @ts-ignore
    //         MockedButton.mock.calls[2][0].onClick();
    //     });
    //
    //     expect(addSuccessMessage).not.toHaveBeenCalled();
    //     expect(addErrorMessage).toHaveBeenCalledTimes(2);
    //     expect(addErrorMessage).toHaveBeenNthCalledWith(2, "An error in updating the contract occurs: Generic error");
    //     expect(pushMock).not.toHaveBeenCalled();
    // });
});


