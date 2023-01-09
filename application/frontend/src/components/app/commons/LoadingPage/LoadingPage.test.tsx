import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import LP, {LoadingPage} from "./LoadingPage";
import {mocked} from "ts-jest/utils";
import Lottie from "react-lottie";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);

jest.mock('react-lottie', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'Lottie'}>{children}</div>)
});
jest.mock('react-fade-in', () => {
    return jest.fn().mockImplementation(({children}) => <div className={'FadeIn'}>{children}</div>)
});
describe('HomePage test', () => {
    const MockedLottie = mocked(Lottie, true);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            <Provider store={mockStore({
                loading: {
                    show: false,
                    text: null
                }
            })}>
                <LP/>
            </Provider>
        );
        mount(
            <LoadingPage loading={{show: false, text: null}}/>
        );
    });
    it('Content test', async () => {
        const component = mount(
            <LoadingPage loading={{show: true, text: 'loadingTextTest'}}/>
        );
        expect(component.find('h1').text()).toEqual('loadingTextTest');
        expect(MockedLottie).toHaveBeenCalledTimes(1);
    });
});