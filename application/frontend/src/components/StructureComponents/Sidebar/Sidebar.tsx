import {RootState} from "../../../redux/store";
import {selectCompanyIndustrialSector, selectUserLoggedIn} from "../../../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import styles from './Sidebar.module.scss'
import UneceLogo from "../../../assets/images/UNECELogo2.png";
import {Link, useLocation} from "react-router-dom";
import {AiOutlineAudit, AiOutlineExperiment, AiOutlineHome, AiOutlineSwap, AiOutlineUser} from "react-icons/ai";
import {Burger} from "./Burger/Burger";
import { useMediaQuery } from 'react-responsive';
import {
    CERTIFICATION_TYPE_MATERIAL,
    CERTIFICATION_TYPE_SCOPE, CERTIFICATION_TYPE_SELF,
    CERTIFICATION_TYPE_TRANSACTION
} from "../../app/commons/transactions/certifications/insert/CertificationInsertion";
import {useTranslation} from "react-i18next";
import {pathChangeListener} from "../../../routes/Routes";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state),
        companyIndustrialSector: selectCompanyIndustrialSector(state)
    }
);

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
}

export const Sidebar = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [compressedSidebarView, setCompressedSidebarView] = React.useState<boolean>(false);

    const { t } = useTranslation();

    let location = useLocation();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    React.useEffect(() => {
        //Detect path change -> close the sidebar
        setOpen(false);
        setCompressedSidebarView(pathChangeListener(location));
    }, [location]);

    const content = <>
        <div className={styles.LogoContainer}>
            <Link to="/">
                <img alt="unece-logo" src={UneceLogo} className={styles.Logo}/>
            </Link>
        </div>
        <div>
            <Link className={`${styles.LinkContainerRow} ${location.pathname === '/user' && styles.LinkContainerRowSelected}`} to={"/user"}>
                <div className={styles.IconLinkContainer}>
                    <AiOutlineUser />
                </div>
                <div className={styles.MainLinkContainer}>
                    <div className={styles.SingleInfo}>{props.userLoggedIn?.firstname || '-'}&nbsp;{props.userLoggedIn?.lastname || '-'}</div>
                </div>
            </Link>
            <Link className={`${styles.LinkContainerRow} ${location.pathname === '/company' && styles.LinkContainerRowSelected}`} to={"/company"}>
                <div className={styles.IconLinkContainer}>
                    <AiOutlineHome />
                </div>
                <div className={styles.MainLinkContainer}>
                    <div className={styles.SingleInfo}>{props.userLoggedIn?.company?.companyName || '-'}</div>
                </div>
            </Link>
        </div>
        <div>
            { props.userLoggedIn?.company?.partnerType?.name !== "certifier" &&
                <>
                    <div className={styles.Divider}/>
                    <div className={`${styles.HeaderContainerRow} 
                        ${(location.pathname === '/' + props.companyIndustrialSector + '/transactions/contract' ||
                        location.pathname === '/' + props.companyIndustrialSector + '/transactions/order' ||
                        location.pathname === '/' + props.companyIndustrialSector + '/transactions/shipping') &&
                    styles.HeaderRowSelected}`}>
                        <div className={styles.IconLinkContainer}>
                            <AiOutlineSwap/>
                        </div>
                        <div className={styles.MainLinkContainer}>
                            {t('sidebar.traceability_section')}
                        </div>
                    </div>
                    <Link
                        className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/contract' && styles.LinkContainerRowSelected}`}
                        to={"/" + props.companyIndustrialSector + "/transactions/contract"}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('contract')}
                        </div>
                    </Link>
                    <Link
                        className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/order' && styles.LinkContainerRowSelected}`}
                        to={"/" + props.companyIndustrialSector + "/transactions/order"}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('order')}
                        </div>
                    </Link>
                    <Link
                        className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/shipping' && styles.LinkContainerRowSelected}`}
                        to={"/" + props.companyIndustrialSector + "/transactions/shipping"}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('shipment')}
                        </div>
                    </Link>
                </>
            }

            <div className={styles.Divider}/>
            <div className={`${styles.HeaderContainerRow} 
                    ${(location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification') &&
            styles.HeaderRowSelected}`}>
                <div className={styles.IconLinkContainer}>
                    <AiOutlineAudit />
                </div>
                <div className={styles.MainLinkContainer}>
                    {t('sidebar.certifications_section')}
                </div>
            </div>

            {props.userLoggedIn?.company?.partnerType?.name === "certifier" ?
                <>
                    <Link className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification/' + CERTIFICATION_TYPE_SCOPE && styles.LinkContainerRowSelected}`} to={"/" + props.companyIndustrialSector + "/transactions/certification/" + CERTIFICATION_TYPE_SCOPE}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('scope_certification')}
                        </div>
                    </Link>
                    <Link className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification/' + CERTIFICATION_TYPE_TRANSACTION && styles.LinkContainerRowSelected}`} to={"/" + props.companyIndustrialSector + "/transactions/certification/" + CERTIFICATION_TYPE_TRANSACTION}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('transaction_certification')}
                        </div>
                    </Link>
                    <Link className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification/' + CERTIFICATION_TYPE_MATERIAL && styles.LinkContainerRowSelected}`} to={"/" + props.companyIndustrialSector + "/transactions/certification/" + CERTIFICATION_TYPE_MATERIAL}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('material_certification')}
                        </div>
                    </Link>
                </>
                :
                <>
                    <Link className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification/' + CERTIFICATION_TYPE_SELF && styles.LinkContainerRowSelected}`} to={"/" + props.companyIndustrialSector + "/transactions/certification/" + CERTIFICATION_TYPE_SELF}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('self_assessment_certification')}
                        </div>
                    </Link>
                    <Link className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification/' + CERTIFICATION_TYPE_SCOPE && styles.LinkContainerRowSelected}`} to={"/" + props.companyIndustrialSector + "/transactions/certification/" + CERTIFICATION_TYPE_SCOPE}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('scope_certification')}
                        </div>
                    </Link>
                    <Link className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transactions/certification/' + CERTIFICATION_TYPE_MATERIAL && styles.LinkContainerRowSelected}`} to={"/" + props.companyIndustrialSector + "/transactions/certification/" + CERTIFICATION_TYPE_MATERIAL}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('material_certification')}
                        </div>
                    </Link>
                </>
            }
            { props.userLoggedIn?.company?.partnerType?.name !== "certifier" &&
                <>
                    <div className={styles.Divider}/>
                    <div className={`${styles.HeaderContainerRow} 
                        ${(location.pathname === '/' + props.companyIndustrialSector + '/transformationPlans/create') && styles.HeaderRowSelected}`}>
                        <div className={styles.IconLinkContainer}>
                            <AiOutlineExperiment/>
                        </div>
                        <div className={styles.MainLinkContainer}>
                            {t('sidebar.transformations_section')}
                        </div>
                    </div>
                    <Link
                        className={`${styles.LinkContainerRow} ${location.pathname === '/' + props.companyIndustrialSector + '/transformationPlans/create' && styles.LinkContainerRowSelected}`}
                        to={"/" + props.companyIndustrialSector + "/transformationPlans/create"}>
                        <div className={styles.IconLinkContainer}/>
                        <div className={styles.MainLinkContainer}>
                            {t('transformation')}
                        </div>
                    </Link>
                </>
            }
        </div>
    </>;

    if (isTabletOrMobile) {
        return (// @ts-ignore
            <div style={{position: 'fixed', height: '4rem'}}>
                <div className={styles.BurgerContainer}>
                    <Burger open={open} setOpen={setOpen}/>
                    <div className={styles.LogoContainer}>
                        <Link to="/">
                            <img alt="unece-logo" src={UneceLogo} className={styles.Logo}/>
                        </Link>
                    </div>
                </div>
                <nav className={`${styles.Menu} ${open ? styles.translateOpen : styles.translateClose} ${styles.Compressed}`}>
                    {content}
                </nav>
            </div>
        )
    }

    if (compressedSidebarView) {
        return (
            <div style={{position: 'fixed', height: '4rem'}}>
                <div className={styles.BurgerContainer}>
                    <div className={styles.LogoContainer}>
                        <Link to="/">
                            <img alt="unece-logo" src={UneceLogo} className={styles.Logo}/>
                        </Link>
                    </div>
                </div>
                <nav className={`${styles.Menu} ${open ? styles.translateOpen : styles.translateClose} ${styles.Compressed}`}>
                    {content}
                </nav>
            </div>
        );
    }

    return (
        <div style={{position: 'fixed'}}>
            <nav className={`${styles.Menu} ${styles.Expanded}`}>
                {content}
            </nav>
        </div>
    )
}

export default connector(Sidebar);