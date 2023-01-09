import React from 'react';
import {RootState} from "../../../redux/store";
import {selectUserLoggedIn} from "../../../redux/store/stateSelectors";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {connect, ConnectedProps} from "react-redux";
import styles from './Header.module.scss';
import {Link} from "react-router-dom";
import {GenericCard} from "../../GenericComponents/GenericCard/GenericCard";
import {useTranslation} from "react-i18next";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state)
    }
);

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    handleLogout: () => void
    //Header props
}

export const Header = (props: Props) => {
    const { t } = useTranslation();

    return (
        <div className={styles.Wrapper}>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Link className={styles.Link} to="/">{t("unece_title")}</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Nav>
                        {
                            !props.userLoggedIn &&
                            <>
                                <Nav.Link color="inherit"><Link className={styles.Link} to="/login">{t("signin")}</Link></Nav.Link>
                            </>
                        }
                        {
                            props.userLoggedIn &&
                            <NavDropdown title={props.userLoggedIn.email} id="userLogged">
                                <NavDropdown.Item>{t("profile")}</NavDropdown.Item>
                                <NavDropdown.Item onClick={props.handleLogout}>{t("logout")}</NavDropdown.Item>
                                {/*<NavDropdown.Divider />*/}
                                {/*<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                            </NavDropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {
                props.userLoggedIn &&
                <div className={`${styles.Row} mb-4`}>
                    <div className="mr-1 w-50">
                        <GenericCard
                            // icon={<GoPerson/>}
                            title={`${t("user_information")}:`}
                            elements={[
                                {name: t("user.firstname"), value: props.userLoggedIn?.firstname},
                                {name: t("user.lastname"), value: props.userLoggedIn?.lastname}
                            ]}/>
                    </div>
                    <div className="w-50">
                        <GenericCard
                            title={`${t("company_information")}:`}
                            elements={[
                                {name: t("name"), value: props.userLoggedIn?.company?.companyName},
                                {name: t("address"), value: props.userLoggedIn?.company?.address1}
                            ]}/>
                    </div>
                </div>
            }
        </div>
    );
};

export default connector(Header);
