import React from 'react';
import HomePage from "../components/app/commons/HomePage/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import GraphPage from "../components/app/commons/GraphPage/GraphPage";
import ContractTradeInsert from "../components/app/commons/transactions/trades/insert/ContractTradeInsert/ContractTradeInsert";
import OrderTradeInsert from "../components/app/commons/transactions/trades/insert/OrderTradeInsert/OrderTradeInsert";
import ShippingTradeInsert from "../components/app/commons/transactions/trades/insert/ShippingTradeInsert/ShippingTradeInsert";
import TransformationPlanInsert from "../components/app/commons/transactions/transformationPlan/insert/TrasformationPlanInsert/TransformationPlanInsert";
import TransformationPlanView from "../components/app/commons/transactions/transformationPlan/view/TransformationPlanView/TransformationPlanView";
import UserPage from "../components/app/commons/UserPage/UserPage";
import DocumentsHistoryPage from "../components/app/commons/DocumentsHistoryPage/DocumentsHistoryPage";
import TradeHandler from "../components/app/commons/transactions/trades/handlers/TradeHandler";
import TradeInsertion from "../components/app/commons/transactions/trades/insert/TradeInsertion";
import CertificationInsertion from "../components/app/commons/transactions/certifications/insert/CertificationInsertion";
import SelfCertificationInsert from "../components/app/commons/transactions/certifications/insert/SelfCertificationInsert/SelfCertificationInsert";
import MaterialCertificationInsert from "../components/app/commons/transactions/certifications/insert/MaterialCertificationInsert/MaterialCertificationInsert";
import ScopeCertificationInsert from "../components/app/commons/transactions/certifications/insert/ScopeCertificationInsert/ScopeCertificationInsert";
import TransactionCertificationInsert from "../components/app/commons/transactions/certifications/insert/TransactionCertificationInsert/TransactionCertificationInsert";
import MaterialCertificationHandler from "../components/app/commons/transactions/certifications/handlers/MaterialCertificationHandler/MaterialCertificationHandler";
import ScopeCertificationHandler from "../components/app/commons/transactions/certifications/handlers/ScopeCertificationHandler/ScopeCertificationHandler";
import SelfCertificationHandler from "../components/app/commons/transactions/certifications/handlers/SelfCertificationHandler/SelfCertificationHandler";
import TransactionCertificationHandler from "../components/app/commons/transactions/certifications/handlers/TransactionCertificationHandler/TransactionCertificationHandler";
import CompanyPage from "../components/app/commons/CompanyPage/CompanyPage";
import {Switch} from "react-router-dom";
import {
    MATERIAL_CERTIFICATION_CONFIRMATION_PATH,
    SCOPE_CERTIFICATION_CONFIRMATION_PATH,
    SELF_CERTIFICATION_CONFIRMATION_PATH,
    TRADE_CONFIRMATION_PATH,
    TRANSACTION_CERTIFICATION_CONFIRMATION_PATH,
    TRANSFORMATION_PLAN_PATH
} from "./Routes";

type Props = {
    authenticated: boolean,
    handleLogout: () => void,
    companyIndustrialSector: string
}

export function CommonRoutes(props: Props) {
    return (
        // this router render the routes of the common components
        // even if the path is different depending on the company industrial sector
        <Switch>
            <ProtectedRoute
                path="/"
                exact={true}
                component={() => <HomePage/>}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path='/user'
                exact={true}
                component={() => <UserPage handleLogout={props.handleLogout}/>}
                authenticated={props.authenticated}
                redirectPath={'/login'} />
            <ProtectedRoute
                path='/company'
                exact={true}
                component={() => <CompanyPage />}
                authenticated={props.authenticated}
                redirectPath={'/login'} />
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/contract"}
                exact={true}
                component={() => <TradeInsertion component={ContractTradeInsert}/>}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/order"}
                exact={true}
                component={() => <TradeInsertion component={OrderTradeInsert}/>}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/shipping"}
                exact={true}
                component={() => <TradeInsertion component={ShippingTradeInsert}/>}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transformationPlans/create"}
                exact={true}
                component={TransformationPlanInsert}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/certification/self"}
                exact={true}
                component={() => <CertificationInsertion component={SelfCertificationInsert} />}
                authenticated={props.authenticated}
                redirectPath={"/login"} />
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/certification/material"}
                exact={true}
                component={() => <CertificationInsertion component={MaterialCertificationInsert} />}
                authenticated={props.authenticated}
                redirectPath={"/login"} />
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/certification/scope"}
                exact={true}
                component={() => <CertificationInsertion component={ScopeCertificationInsert} />}
                authenticated={props.authenticated}
                redirectPath={"/login"} />
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/transactions/certification/transaction"}
                exact={true}
                component={() => <CertificationInsertion component={TransactionCertificationInsert} />}
                authenticated={props.authenticated}
                redirectPath={"/login"} />
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + MATERIAL_CERTIFICATION_CONFIRMATION_PATH}
                exact={true}
                component={MaterialCertificationHandler}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + SCOPE_CERTIFICATION_CONFIRMATION_PATH}
                exact={true}
                component={ScopeCertificationHandler}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + SELF_CERTIFICATION_CONFIRMATION_PATH}
                exact={true}
                component={SelfCertificationHandler}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + TRANSACTION_CERTIFICATION_CONFIRMATION_PATH}
                exact={true}
                component={TransactionCertificationHandler}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + TRADE_CONFIRMATION_PATH}
                exact={true}
                component={TradeHandler}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + TRANSFORMATION_PLAN_PATH}
                exact={true}
                component={TransformationPlanView}
                authenticated={props.authenticated}
                redirectPath={'/login'} />
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/graph/:id"}
                exact={true}
                component={GraphPage}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                path={"/" + props.companyIndustrialSector + "/documentsHistory/:id"}
                exact={true}
                component={DocumentsHistoryPage}
                authenticated={props.authenticated}
                redirectPath={'/login'}/>
            <ProtectedRoute
                authenticated={props.authenticated}
                redirectPath={'/'}/>
        </Switch>
    )
}
