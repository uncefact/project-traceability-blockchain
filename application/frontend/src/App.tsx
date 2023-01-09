import React, {useEffect} from 'react';
import styles from './App.module.scss';
import {deleteAccessToken, getAccessToken, saveAccessToken} from "./api/utils";
import {removeUserLoggedIn, setUserLoggedIn} from "./redux/store/UserLoggedIn/actions";
import {connect, ConnectedProps} from "react-redux";
import InfoControllerApi from './api/InfoControllerApi';
import {useHistory, useLocation} from "react-router-dom";
import {LoginRequest} from "@unece/cotton-fetch";

import 'bootstrap/dist/css/bootstrap.min.css';
import {addErrorMessage, addSuccessMessage} from "./redux/store/Messages/actions";
import MessagesBar from "./components/GenericComponents/MessagesBar/MessagesBar";
import {startLoading, stopLoading} from "./redux/store/Loading/actions";
import LoadingPage from "./components/app/commons/LoadingPage/LoadingPage";
import Sidebar from './components/StructureComponents/Sidebar/Sidebar'
import {Worker} from '@react-pdf-viewer/core';
import {useMediaQuery} from "react-responsive";
import Routes, {pathChangeListener} from "./routes/Routes";
import {removeCompanyIndustrialSector, setCompanyIndustrialSector} from "./redux/store/CompanyIndustrialSector/actions";
import {useTranslation} from "react-i18next";
import  "./i18n/config";

const mapDispatch = {
    setCompanyIndustrialSector,
    removeCompanyIndustrialSector,
    setUserLoggedIn,
    removeUserLoggedIn,
    addSuccessMessage,
    addErrorMessage,
    startLoading,
    stopLoading
};

const connector = connect(null, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    //My props
}

export function App(props: Props) {
    const history = useHistory();
    const [userAuthenticated, setUserAuthenticated] = React.useState<boolean>(false);
    const [contentLoaded, setContentLoaded] = React.useState<boolean>(false);
    const [compressedSidebarView, setCompressedSidebarView] = React.useState<boolean>(false);
    let location = useLocation();
    const { t, i18n } = useTranslation();
    // @ts-ignore
    let { from } = location.state || { from: { pathname: "/" } };
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

    useEffect(() => {
        loadUserInfo();
        detectLanguage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCompressedSidebarView(pathChangeListener(location));
    }, [location]);

    const detectLanguage = async () => {
        let language = navigator.language;
        // TODO: this if force the language to be "en", if we will add more languages we have to remove or adapt this condition
        if (language === 'en') {
            i18n.changeLanguage(language);
        }
    }

    const loadUserInfo = async () => {
        let resp = null;
        if (getAccessToken()) {
            try {
                props.startLoading(t("popups.loading.user_info"))
                resp = await InfoControllerApi.getInfo();
                if (resp) {
                    props.setUserLoggedIn(resp);
                    const sector = resp?.company?.companyIndustry?.name?.toLowerCase();
                    setUserAuthenticated(true);
                    if (sector)
                        props.setCompanyIndustrialSector(sector);
                }
            } catch (error) {
                handleLogout();
            } finally {
                props.stopLoading();
            }
        } else {
            removeCredentials();
        }
        setContentLoaded(true);
    };

    const handleLogin = async (login: LoginRequest) => {
        try {
            props.startLoading(t("popups.loading.generic"));

            const resp = await InfoControllerApi.login(login);
            if (resp.token) {
                saveAccessToken(resp.token);
                await loadUserInfo();
                history.replace(from);
                // history.push('/');
            }
        } catch (error) {
            removeCredentials();
            if (String(error).includes("Failed to fetch"))
                props.addErrorMessage(t("popups.errors.server_not_available"));
            else
                props.addErrorMessage(t("popups.errors.invalid_credentials"));
        } finally {
            props.stopLoading();
        }
    };

    const removeCredentials = () => {
        deleteAccessToken();
        setUserAuthenticated(false);
        props.removeUserLoggedIn();
        props.removeCompanyIndustrialSector();
    };

    const handleLogout = async () => {
        removeCredentials()
        props.addSuccessMessage(t("popups.success.logout"));
    };

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            <div className={styles.App}>
                <div className={styles.SidebarContainer}>
                    {
                        userAuthenticated &&
                        <Sidebar />
                    }
                </div>
                <div className={`${styles.ContentContainer} ${!userAuthenticated && styles.FullWidth} ${(isTabletOrMobile || compressedSidebarView) && styles.TabletOrMobile}`}>
                    <div className={styles.Content}>
                        {
                            contentLoaded &&
                            <Routes authenticated={userAuthenticated} handleLogin={handleLogin} handleLogout={handleLogout} />
                        }
                    </div>
                </div>

                <LoadingPage/>
                <MessagesBar/>
            </div>
        </Worker>
    );
}

export default connector(App);
