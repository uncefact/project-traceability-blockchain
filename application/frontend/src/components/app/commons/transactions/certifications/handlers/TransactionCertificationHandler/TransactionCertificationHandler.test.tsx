import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import {act} from "react-dom/test-utils";
import MCH, {TransactionCertificationHandler} from "./TransactionCertificationHandler";
import {mocked} from "ts-jest/utils";
import {useLocation} from "react-router-dom";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {
    ConfirmationCertificationPresentable,
    ConfirmationCertificationPresentableStatusEnum,
} from "@unece/cotton-fetch";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {CertificationViewer} from "../../view/CertificationViewer";
import {CertificationConfirmation} from "../../confirm/CertificationConfirmation";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock('react-router-dom', () => {
    return {
        useLocation: jest.fn(),
        useRouteMatch: jest.fn(),
        useHistory: jest.fn()
    }
});

jest.mock("../../../../../../../api/CertificationControllerApi", () => {
    return {
        getCertification: jest.fn()
    }
})

jest.mock("../../confirm/CertificationConfirmation", () => {
    return {
        CertificationConfirmation: jest.fn().mockImplementation(({children}) => <div className={'CertificationConfirmation'}>{children}</div>)
    }
});

jest.mock("../../view/CertificationViewer", () => {
    return {
        CertificationViewer: jest.fn().mockImplementation(({children}) => <div className={'CertificationViewer'}>{children}</div>)
    }
});

describe('Transaction certification handler test', () => {

    const MockedUseLocation = mocked(useLocation, true);
    const MockedCertificationControllerApi = mocked(CertificationControllerApi, true);
    const MockedCertificationViewer = mocked(CertificationViewer, true);
    const MockedCertificationConfirmation = mocked(CertificationConfirmation, true);

    const addErrorMessage = jest.fn();
    const addSuccessMessage = jest.fn();
    const startLoading = jest.fn();
    const stopLoading = jest.fn();
    const userLoggedIn = {
        company: {companyName: "companyTest"}
    };
    // @ts-ignore
    const uneceCottonTracking : UneceCottonTracking = {};

    // @ts-ignore
    MockedUseLocation.mockReturnValue({
        state: { from: { pathname: "/previous_path" } },
        pathname: "/actual_path"
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // jest.restoreAllMocks();
    });

    it('Render without crashing', async () => {
        mount(
            <Provider store={store}>
                <MCH />
            </Provider>
        )
        mount(
            <TransactionCertificationHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );
    });

    it('Render without crashing async', async () => {

        await act(async () => {
            await mount(
                <TransactionCertificationHandler
                    addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });
    });

    it('Content test', async () => {
        const certificationRetrieved : ConfirmationCertificationPresentable = {
            contractorReferenceNumber: "1234",
            status: ConfirmationCertificationPresentableStatusEnum.Pending,
            approverName: userLoggedIn.company.companyName
        };

        let component : any = null;

        await act(async () => {
            component = await mount(<TransactionCertificationHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            )});

        expect(component.find('div').at(0).text()).toEqual("loading...");

        // redirect to certification confirmation
        MockedCertificationConfirmation.mockClear();
        MockedCertificationViewer.mockClear();
        MockedCertificationControllerApi.getCertification.mockReturnValue(Promise.resolve(certificationRetrieved));
        await act(async () => {
            await mount(<TransactionCertificationHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            )});
        expect(MockedCertificationConfirmation).toHaveBeenCalledTimes(1);

        // redirect to certification view due to status not Penging
        certificationRetrieved.status = ConfirmationCertificationPresentableStatusEnum.Accepted;
        MockedCertificationControllerApi.getCertification.mockReturnValue(Promise.resolve(certificationRetrieved));
        await act(async () => {
            mount(<TransactionCertificationHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            )});
        expect(MockedCertificationViewer).toHaveBeenCalledTimes(1);

        // redirect to certification view due to user's permission
        MockedCertificationConfirmation.mockClear();
        MockedCertificationViewer.mockClear();
        certificationRetrieved.approverName = "company1";
        certificationRetrieved.status = ConfirmationCertificationPresentableStatusEnum.Pending;
        MockedCertificationControllerApi.getCertification.mockReturnValue(Promise.resolve(certificationRetrieved));
        await act(async () => {
            mount(<TransactionCertificationHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            )});
        expect(MockedCertificationViewer).toHaveBeenCalledTimes(1);

    });

    it('Certification loading failed', async () => {
        MockedCertificationControllerApi.getCertification.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            mount(<TransactionCertificationHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            );
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.transaction_certification: Generic error");
    });

});