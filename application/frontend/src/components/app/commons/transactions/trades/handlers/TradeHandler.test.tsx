import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import {act} from "react-dom/test-utils";
import TH, {TradeHandler} from "./TradeHandler";
import {mocked} from "ts-jest/utils";
import {useLocation} from "react-router-dom";
import TradeControllerApi from "../../../../../../api/TradeControllerApi";
import {
    ConfirmationTradePresentable,
    ConfirmationTradePresentableStatusEnum
} from "@unece/cotton-fetch";
import TradeConfirm from "../confirm/TradeConfirm/TradeConfirm";
import TradeView from "../view/TradeView/TradeView";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

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

jest.mock("../../../../../../api/TradeControllerApi", () => {
   return {
       getContractById: jest.fn(),
       getOrderById: jest.fn(),
       getShippingById: jest.fn()
   }
});

jest.mock("../confirm/TradeConfirm/TradeConfirm", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'TradeConfirm'}>{children}</div>)
});

jest.mock("../view/TradeView/TradeView", () => {
    return jest.fn().mockImplementation(({children}) => <div className={'TradeView'}>{children}</div>)
});

describe('Trade handler test', () => {

    const MockedUseLocation = mocked(useLocation, true);
    const MockedTradeControllerApi = mocked(TradeControllerApi, true);
    const MockedTradeConfirm = mocked(TradeConfirm, true);
    const MockedTradeView = mocked(TradeView, true);

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
                <TH />
            </Provider>
        )
        mount(
            <TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        );
    });

    it('Render without crashing async', async () => {

        await act(async () => {
            await mount(
                <TradeHandler
                    addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                    startLoading={startLoading} stopLoading={stopLoading}
                    userLoggedIn={userLoggedIn} />
            );
        });
    });

    it('Content test - generic (case contract)', async () => {
        // just not to go into the default case of the switch (in order to get a valid response)
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("contract");
        const tradeRetrieved : ConfirmationTradePresentable = {
            contractorReferenceNumber: "1234",
            status: ConfirmationTradePresentableStatusEnum.Pending,
            approverName: userLoggedIn.company.companyName
        };

        let component : any = null;

        await act(async () => {
            component = await mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        )});

        expect(component.find('div').at(0).text()).toEqual("loading...");

        // redirect to trade confirmation
        MockedTradeView.mockClear();
        MockedTradeConfirm.mockClear();
        MockedTradeControllerApi.getContractById.mockReturnValue(Promise.resolve(tradeRetrieved));
        await act(async () => {
            await mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        )});
        expect(MockedTradeConfirm).toHaveBeenCalledTimes(1);

        // redirect to trade view due to status not Penging
        tradeRetrieved.status = ConfirmationTradePresentableStatusEnum.Accepted;
        MockedTradeControllerApi.getContractById.mockReturnValue(Promise.resolve(tradeRetrieved));
        await act(async () => {
            mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        )});
        expect(MockedTradeView).toHaveBeenCalledTimes(1);

        // redirect to trade view due to user's permission
        MockedTradeView.mockClear();
        MockedTradeConfirm.mockClear();
        tradeRetrieved.approverName = "company1";
        tradeRetrieved.status = ConfirmationTradePresentableStatusEnum.Pending;
        MockedTradeControllerApi.getContractById.mockReturnValue(Promise.resolve(tradeRetrieved));
        await act(async () => {
            mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        )});
        expect(MockedTradeView).toHaveBeenCalledTimes(1);

    });

    it('Content test - order view', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("order");
        const tradeRetrieved : ConfirmationTradePresentable = {
            contractorReferenceNumber: "1234",
            status: ConfirmationTradePresentableStatusEnum.Accepted,
            approverName: userLoggedIn.company.companyName
        };

        let component : any = null;
        MockedTradeControllerApi.getOrderById.mockReturnValue(Promise.resolve(tradeRetrieved));
        await act(async () => {
            component = await mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
        )});

        expect(MockedTradeView).toHaveBeenCalledTimes(1);
        expect(MockedTradeConfirm).not.toHaveBeenCalled();
    });

    it('Content test - shipping confirm', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("shipping");
        const tradeRetrieved : ConfirmationTradePresentable = {
            contractorReferenceNumber: "1234",
            status: ConfirmationTradePresentableStatusEnum.Pending,
            approverName: userLoggedIn.company.companyName
        };

        let component : any = null;
        MockedTradeControllerApi.getShippingById.mockReturnValue(Promise.resolve(tradeRetrieved));
        await act(async () => {
            component = await mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            )});

        expect(MockedTradeConfirm).toHaveBeenCalledTimes(1);
        expect(MockedTradeView).not.toHaveBeenCalled();
    });

    it('Loading trade failed', async () => {
        jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue("contract");
        MockedTradeControllerApi.getContractById.mockImplementation(() => Promise.reject("Generic error"));
        await act(async () => {
            mount(<TradeHandler
                addErrorMessage={addErrorMessage} addSuccessMessage={addSuccessMessage}
                startLoading={startLoading} stopLoading={stopLoading}
                userLoggedIn={userLoggedIn} />
            );
        });
        expect(addErrorMessage).toHaveBeenCalledTimes(1);
        expect(addErrorMessage).toHaveBeenNthCalledWith(1, "popups.errors.trade: Generic error");

    });

});