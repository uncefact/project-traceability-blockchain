import React from 'react';
import {Route, Switch} from 'react-router-dom';
import LoginPage from "../components/app/commons/LoginPage/LoginPage";
import {LoginRequest} from "@unece/cotton-fetch";
import ProtectedRoute from "./ProtectedRoute";
import {CommonRoutes} from "./CommonRoutes";
import OnboardingPage from "../components/app/commons/OnboardingPage/OnboardingPage";
import {RootState} from "../redux/store";
import {selectCompanyIndustrialSector} from "../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";
import * as H from "history";

export const COMPANY_SECTOR_COTTON = "cotton";
export const COMPANY_SECTOR_LEATHER = "leather";
export const TRADE_CONFIRMATION_PATH = "/trades/:id/confirmation";
export const MATERIAL_CERTIFICATION_CONFIRMATION_PATH = "/certifications/material/:id/confirmation";
export const SCOPE_CERTIFICATION_CONFIRMATION_PATH = "/certifications/scope/:id/confirmation";
export const SELF_CERTIFICATION_CONFIRMATION_PATH = "/certifications/self/:id/confirmation";
export const TRANSACTION_CERTIFICATION_CONFIRMATION_PATH = "/certifications/transaction/:id/confirmation";
export const TRANSFORMATION_PLAN_PATH = "/transformationPlans/:id";
export const COMPANY_ONBOARDING_PATH = "/companies/:token/onboarding";
export const USER_ONBOARDING_PATH = "/user/:token/onboarding";
export const ONBOARDING_PATH = "/:type/:token/onboarding";

export const pathChangeListener = (location: H.Location) => {
    if (location.pathname.match(/^\/[^\/]+\/graph\//s) ||
        location.pathname.match(/^\/[^\/]+\/documentsHistory\//s)) {
        return true;
    }
    return false;
}

const mapState = (state: RootState) => (
    {
        companyIndustrialSector: selectCompanyIndustrialSector(state)
    }
);

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    authenticated: boolean,
    handleLogin: (login: LoginRequest) => void,
    handleLogout: () => void,
}

export function Routes(props: Props) {
    return (
        props.companyIndustrialSector ?
            <Switch>
                <CommonRoutes
                    authenticated={props.authenticated}
                    handleLogout={props.handleLogout}
                    companyIndustrialSector={props.companyIndustrialSector}/>

                    {/*qui eventualmente si possono aggiungere degli if a seconda del settore industriale, es:*/}
                    {/*props.companyIndustrialSector === COMPANY_SECTOR_COTTON &&*/}
                    {/*    <CottonRoutes authenticated={props.authenticated} handleLogout={props.handleLogout} handleLogin={props.handleLogin}/>*/}
            </Switch>
            :
            <Switch>
                <Route
                    path="/login"
                    exact
                    render={p => <LoginPage handleLogin={props.handleLogin} {...p}/>}/>
                <Route
                    path={ONBOARDING_PATH}
                    exact={true}
                    render={() => <OnboardingPage />} />
                <ProtectedRoute
                    authenticated={props.authenticated}
                    redirectPath={'/login'}/>
            </Switch>
    )
}

export default connector(Routes);
