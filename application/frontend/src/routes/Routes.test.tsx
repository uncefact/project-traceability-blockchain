import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {MemoryRouter} from 'react-router';
import {mocked} from "ts-jest/utils";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../components/app/commons/LoginPage/LoginPage";
import {pathChangeListener, Routes} from "./Routes";
import {CommonRoutes} from "./CommonRoutes";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-i18next", () => {
    return {
        useTranslation: jest.fn().mockReturnValue({t: (value: string) => value})
    }
});

jest.mock("./CommonRoutes", () => {
    return {
        CommonRoutes: jest.fn().mockImplementation(({children}) => <div className={"CommonRoutes"}>{children}</div> )
    }
});

jest.mock('../components/app/commons/LoginPage/LoginPage', () => {
    return jest.fn().mockImplementation(()=><div>LoginPage</div>)
});

jest.mock('./ProtectedRoute', () => {
    return jest.fn().mockImplementation(()=><div>ProtectedRoute</div>)
});

describe('LeatherRoutes test', () => {
    const MockedLoginPage = mocked(LoginPage, true);
    const MockedProtectedRoute = mocked(ProtectedRoute, true);
    const MockedCommonRoutes = mocked(CommonRoutes, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Login path',  () => {
        mount(
            <MemoryRouter initialEntries={['/login']}>
                <Routes authenticated={false} handleLogin={()=>{}} handleLogout={()=>{}}/>
            </MemoryRouter>
        );
        expect(MockedLoginPage).toHaveBeenCalledTimes(1);
    });
    it('General path, can be any url',  () => {
        mount(
            <MemoryRouter initialEntries={['/test/to/general/path?param=1']}>
                <Routes authenticated={false} handleLogin={()=>{}} handleLogout={()=>{}}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            authenticated: false,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
    });

    it('Common routes used - companyIndustrialSector defined', () => {
        const handleLogout = jest.fn();
        const sector = "sectorTest";

        mount(
            <MemoryRouter>
                <Routes authenticated={true} handleLogin={()=>{}} handleLogout={handleLogout} companyIndustrialSector={sector}/>
            </MemoryRouter>
        );

        expect(MockedCommonRoutes).toHaveBeenCalledTimes(1);
        expect(MockedCommonRoutes).toHaveBeenNthCalledWith(1, {
            authenticated: true,
            handleLogout: handleLogout,
            companyIndustrialSector: sector,
            computedMatch: expect.anything(),
            location: expect.anything()
        }, {});
    });

    it('Exported function - pathChangeListener', () => {
       let correctLocation = {
           pathname: "/industrialSector/graph/"
       };
       const wrongLocation = {
           pathname: "/test/industrialSector/graph/"
       };

       // @ts-ignore
       expect(pathChangeListener(correctLocation)).toBeTruthy();
       correctLocation = {
           pathname: "/industrialSector/documentsHistory/"
       };
       // @ts-ignore
        expect(pathChangeListener(correctLocation)).toBeTruthy();

       // @ts-ignore
       expect(pathChangeListener(wrongLocation)).toBeFalsy();

    });

})
