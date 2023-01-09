import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
    CommonRoutes,
} from "./CommonRoutes";
import {MemoryRouter} from 'react-router';
import {mocked} from "ts-jest/utils";
import HomePage from "../components/app/commons/HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import GraphPage from "../components/app/commons/GraphPage/GraphPage";
import ContractTradeInsert from "../components/app/commons/transactions/trades/insert/ContractTradeInsert/ContractTradeInsert";
import OrderTradeInsert from "../components/app/commons/transactions/trades/insert/OrderTradeInsert/OrderTradeInsert";
import ShippingTradeInsert from "../components/app/commons/transactions/trades/insert/ShippingTradeInsert/ShippingTradeInsert";
import TransformationPlanInsert from "../components/app/commons/transactions/transformationPlan/insert/TrasformationPlanInsert/TransformationPlanInsert";
import DocumentsHistoryPage from "../components/app/commons/DocumentsHistoryPage/DocumentsHistoryPage";
import TradeInsertion from "../components/app/commons/transactions/trades/insert/TradeInsertion";
import CertificationInsertion from "../components/app/commons/transactions/certifications/insert/CertificationInsertion";
import MaterialCertificationHandler from "../components/app/commons/transactions/certifications/handlers/MaterialCertificationHandler/MaterialCertificationHandler";
import ScopeCertificationHandler from "../components/app/commons/transactions/certifications/handlers/ScopeCertificationHandler/ScopeCertificationHandler";
import SelfCertificationHandler from "../components/app/commons/transactions/certifications/handlers/SelfCertificationHandler/SelfCertificationHandler";
import TransactionCertificationHandler from "../components/app/commons/transactions/certifications/handlers/TransactionCertificationHandler/TransactionCertificationHandler";
import TransformationPlanView from "../components/app/commons/transactions/transformationPlan/view/TransformationPlanView/TransformationPlanView";
import SelfCertificationInsert from "../components/app/commons/transactions/certifications/insert/SelfCertificationInsert/SelfCertificationInsert";
import MaterialCertificationInsert from "../components/app/commons/transactions/certifications/insert/MaterialCertificationInsert/MaterialCertificationInsert";
import ScopeCertificationInsert from "../components/app/commons/transactions/certifications/insert/ScopeCertificationInsert/ScopeCertificationInsert";
import TransactionCertificationInsert from "../components/app/commons/transactions/certifications/insert/TransactionCertificationInsert/TransactionCertificationInsert";
import TradeHandler from "../components/app/commons/transactions/trades/handlers/TradeHandler";
import UserPage from "../components/app/commons/UserPage/UserPage";
import {
    COMPANY_SECTOR_COTTON,
    COMPANY_SECTOR_LEATHER,
    MATERIAL_CERTIFICATION_CONFIRMATION_PATH,
    SCOPE_CERTIFICATION_CONFIRMATION_PATH,
    SELF_CERTIFICATION_CONFIRMATION_PATH, TRADE_CONFIRMATION_PATH,
    TRANSACTION_CERTIFICATION_CONFIRMATION_PATH, TRANSFORMATION_PLAN_PATH
} from "./Routes";

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../components/app/commons/GraphPage/GraphPage', () => {
    return jest.fn().mockImplementation(()=><div>GraphPage</div>)

});
jest.mock('../components/app/commons/HomePage/HomePage', () => {
    return jest.fn().mockImplementation(()=><div>HomePage</div>)
});
jest.mock('../components/app/commons/transactions/trades/insert/TradeInsertion', () => {
    return jest.fn().mockImplementation(()=><div>TradeInsertion</div>)
});
jest.mock('../components/app/commons/transactions/trades/insert/ContractTradeInsert/ContractTradeInsert', () => {
    return jest.fn().mockImplementation(()=><div>ContractTrade</div>)
});
jest.mock('../components/app/commons/transactions/trades/insert/OrderTradeInsert/OrderTradeInsert', () => {
    return jest.fn().mockImplementation(()=><div>OrderTrade</div>)
});
jest.mock('../components/app/commons/transactions/trades/insert/ShippingTradeInsert/ShippingTradeInsert', () => {
    return jest.fn().mockImplementation(()=><div>ShippingTrade</div>)
});
jest.mock('../components/app/commons/transactions/transformationPlan/insert/TrasformationPlanInsert/TransformationPlanInsert', () => {
    return jest.fn().mockImplementation(()=><div>TransformationPlanInsert</div>)
});
jest.mock('../components/app/commons/transactions/certifications/insert/CertificationInsertion', () => {
    return jest.fn().mockImplementation(()=><div>CertificationInsertion</div>)
});
jest.mock('../components/app/commons/transactions/certifications/handlers/MaterialCertificationHandler/MaterialCertificationHandler', () => {
    return jest.fn().mockImplementation(()=><div>MaterialCertificationHandler</div>)
});
jest.mock('../components/app/commons/transactions/certifications/handlers/ScopeCertificationHandler/ScopeCertificationHandler', () => {
    return jest.fn().mockImplementation(()=><div>ScopeCertificationHandler</div>)
});
jest.mock('../components/app/commons/transactions/certifications/handlers/SelfCertificationHandler/SelfCertificationHandler', () => {
    return jest.fn().mockImplementation(()=><div>SelfCertificationHandler</div>)
});
jest.mock('../components/app/commons/transactions/certifications/handlers/TransactionCertificationHandler/TransactionCertificationHandler', () => {
    return jest.fn().mockImplementation(()=><div>TransactionCertificationHandler</div>)
});
jest.mock('../components/app/commons/transactions/trades/handlers/TradeHandler', () => {
    return jest.fn().mockImplementation(()=><div>TradeHandler</div>)
});
jest.mock('../components/app/commons/transactions/transformationPlan/view/TransformationPlanView/TransformationPlanView', () => {
    return jest.fn().mockImplementation(()=><div>TransformationPlanView</div>)
});
jest.mock('../components/app/commons/UserPage/UserPage', () => {
    return jest.fn().mockImplementation(()=><div>UserPage</div>)
});

jest.mock('../components/app/commons/DocumentsHistoryPage/DocumentsHistoryPage', () => {
    return jest.fn().mockImplementation(()=><div>DocumentsHistoryPage</div>)
});

jest.mock('./ProtectedRoute', () => {
    return jest.fn().mockImplementation(()=><div>ProtectedRoute</div>)
});

describe('CommonRoutes test - tested with different company industrial sectors: cotton and leather', () => {
    const MockedHomePage = mocked(HomePage, true);
    const MockedProtectedRoute = mocked(ProtectedRoute, true);
    const MockedTradeInsertion = mocked(TradeInsertion, true);
    const MockedTransformationPlanInsert = mocked(TransformationPlanInsert, true);
    const MockedCertificationInsertion = mocked(CertificationInsertion, true);
    const MockedMaterialCertificationHandler = mocked(MaterialCertificationHandler, true);
    const MockedScopeCertificationHandler = mocked(ScopeCertificationHandler, true);
    const MockedSelfCertificationHandler = mocked(SelfCertificationHandler, true);
    const MockedTransactionCertificationHandler = mocked(TransactionCertificationHandler, true);
    const MockedTradeHandler= mocked(TradeHandler, true);
    const MockedTransformationPlanView = mocked(TransformationPlanView, true);
    const MockedUserPage = mocked(UserPage, true);
    const MockedGraphPage = mocked(GraphPage, true);
    const MockedDocumentsHistoryPage = mocked(DocumentsHistoryPage, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Home path', async () => {
        mount(
            <MemoryRouter>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedHomePage).toHaveBeenCalledTimes(1);
    });
    it('User page', async () => {
        mount(
            <MemoryRouter initialEntries={['/user']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/user',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedUserPage).toHaveBeenCalledTimes(1);
        expect(MockedUserPage).toHaveBeenNthCalledWith(1, {handleLogout: expect.any(Function)}, {});
    });
    it('Contract insert path - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + '/transactions/contract']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + '/transactions/contract',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTradeInsertion).toHaveBeenCalledTimes(1);
        expect(MockedTradeInsertion).toHaveBeenNthCalledWith(1, {component: ContractTradeInsert}, {});
    });
    it('Order insert path - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + '/transactions/order']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + '/transactions/order',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTradeInsertion).toHaveBeenCalledTimes(1);
        expect(MockedTradeInsertion).toHaveBeenNthCalledWith(1, {component: OrderTradeInsert}, {});
    });
    it('Shipping insert path - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + '/transactions/shipping']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + '/transactions/shipping',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTradeInsertion).toHaveBeenCalledTimes(1);
        expect(MockedTradeInsertion).toHaveBeenNthCalledWith(1, {component: ShippingTradeInsert}, {});
    });
    it('Transformation plan create - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + '/transformationPlans/create']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=> {}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + '/transformationPlans/create',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTransformationPlanInsert).toHaveBeenCalledTimes(1);
    });
    it('Self certification insert - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + '/transactions/certification/self']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + '/transactions/certification/self',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedCertificationInsertion).toHaveBeenCalledTimes(1);
        expect(MockedCertificationInsertion).toHaveBeenNthCalledWith(1, {component: SelfCertificationInsert}, {});
    });
    it('Material certification insert - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + '/transactions/certification/material']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + '/transactions/certification/material',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedCertificationInsertion).toHaveBeenCalledTimes(1);
        expect(MockedCertificationInsertion).toHaveBeenNthCalledWith(1, {component: MaterialCertificationInsert}, {});
    });
    it('Scope certification insert - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + '/transactions/certification/scope']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + '/transactions/certification/scope',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedCertificationInsertion).toHaveBeenCalledTimes(1);
        expect(MockedCertificationInsertion).toHaveBeenNthCalledWith(1, {component: ScopeCertificationInsert}, {});
    });
    it('Transaction certification insert - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + '/transactions/certification/transaction']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + '/transactions/certification/transaction',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedCertificationInsertion).toHaveBeenCalledTimes(1);
        expect(MockedCertificationInsertion).toHaveBeenNthCalledWith(1, {component: TransactionCertificationInsert}, {});
    });
    it('Material certification handler - redirect to view or confirm - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + MATERIAL_CERTIFICATION_CONFIRMATION_PATH]}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + MATERIAL_CERTIFICATION_CONFIRMATION_PATH,
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedMaterialCertificationHandler).toHaveBeenCalledTimes(1);
    });
    it('Scope certification handler - redirect to view or confirm - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + SCOPE_CERTIFICATION_CONFIRMATION_PATH]}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + SCOPE_CERTIFICATION_CONFIRMATION_PATH,
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedScopeCertificationHandler).toHaveBeenCalledTimes(1);
    });
    it('Self certification handler - redirect to view or confirm - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + SELF_CERTIFICATION_CONFIRMATION_PATH]}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + SELF_CERTIFICATION_CONFIRMATION_PATH,
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedSelfCertificationHandler).toHaveBeenCalledTimes(1);
    });
    it('Transaction certification handler - redirect to view or confirm - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + TRANSACTION_CERTIFICATION_CONFIRMATION_PATH]}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + TRANSACTION_CERTIFICATION_CONFIRMATION_PATH,
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTransactionCertificationHandler).toHaveBeenCalledTimes(1);
    });
    it('Trade handler - redirect to view or confirm - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + TRADE_CONFIRMATION_PATH]}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + TRADE_CONFIRMATION_PATH,
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTradeHandler).toHaveBeenCalledTimes(1);
    });
    it('Transformation plan view - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + TRANSFORMATION_PLAN_PATH]}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + TRANSFORMATION_PLAN_PATH,
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedTransformationPlanView).toHaveBeenCalledTimes(1);
    });

    it('GraphPage path - leather', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_LEATHER + '/graph/1']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_LEATHER}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_LEATHER + '/graph/:id',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedGraphPage).toHaveBeenCalledTimes(1);
    });
    it('DocumentsHistoryPage path - cotton', async () => {
        mount(
            <MemoryRouter initialEntries={['/' + COMPANY_SECTOR_COTTON + '/documentsHistory/1']}>
                <CommonRoutes authenticated={true} handleLogin={()=>{}} handleLogout={()=>{}} companyIndustrialSector={COMPANY_SECTOR_COTTON}/>
            </MemoryRouter>
        );
        expect(MockedProtectedRoute).toHaveBeenCalledTimes(1);
        expect(MockedProtectedRoute).toHaveBeenNthCalledWith(1, {
            path: '/' + COMPANY_SECTOR_COTTON + '/documentsHistory/:id',
            exact: true,
            component: expect.anything(),
            authenticated: true,
            redirectPath: '/login',
            computedMatch: expect.anything(),
            location: expect.anything(),
        }, {});
        mount(MockedProtectedRoute.mock.calls[0][0].component());
        expect(MockedDocumentsHistoryPage).toHaveBeenCalledTimes(1);
    });
})
