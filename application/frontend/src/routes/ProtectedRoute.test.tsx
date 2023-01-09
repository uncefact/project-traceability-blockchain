import Enzyme, {mount} from "enzyme";
import React from "react";
import {mocked} from "ts-jest/utils";
import {Redirect, Route} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => {
    return {
        Redirect: jest.fn().mockImplementation(()=><div>Redirect</div>),
        Route: jest.fn().mockImplementation(() => <div>Route</div>)
    }
});

describe('CottonRoutes test', () => {
    const MockedRedirect = mocked(Redirect, true);
    const MockedRoute = mocked(Route, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('ProtectedRoute - Authenticated', async () => {
        const component = jest.fn().mockImplementation(()=><div>Component</div>);
        let RenderComponent = null;
        mount(
            <ProtectedRoute path={'/pathTest'} exact={true} component={component} authenticated={true} redirectPath={'/redirectPathTest'} />
        );
        expect(MockedRoute).toHaveBeenCalledTimes(1);
        // @ts-ignore
        RenderComponent = MockedRoute.mock.calls[0][0].render();
        mount(
            // @ts-ignore
            RenderComponent
        )
        expect(component).toHaveBeenCalledTimes(1);
    });
    it('ProtectedRoute - Not Authenticated', async () => {
        const component = jest.fn().mockImplementation(()=><div>Component</div>);
        let RenderComponent = null;
        mount(
            <ProtectedRoute path={'/pathTest'} exact={true} component={component} authenticated={false} redirectPath={'/redirectPathTest'} />
        );
        expect(MockedRoute).toHaveBeenCalledTimes(1);
        // @ts-ignore
        RenderComponent = MockedRoute.mock.calls[0][0].render({location: {from: { pathname: "/previous_path" }}});

        mount(
            // @ts-ignore
            RenderComponent
        )

        expect(MockedRedirect).toHaveBeenCalledTimes(1);
        expect(MockedRedirect).toHaveBeenNthCalledWith(1, {
            to: {
                pathname: '/redirectPathTest',
                state: {
                    from: {
                        from: {
                            pathname: "/previous_path"
                        }
                    }
                }
            }
        }, {})
    });
});
