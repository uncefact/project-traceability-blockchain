import {RootState} from "../../../../redux/store";
import {addErrorMessage, addSuccessMessage} from "../../../../redux/store/Messages/actions";
import {connect, ConnectedProps} from "react-redux";
import {Button, Form, InputGroup, Jumbotron} from "react-bootstrap";
import styles from "./OnboardingPage.module.scss";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Role, Country, CompanyPresentable, TotalOnboardingRequest} from "@unece/cotton-fetch";
import UNECELogo from "../../../../assets/images/UNECELogo1.png";
import InfoControllerApi from "../../../../api/InfoControllerApi";
import CompanyControllerApi from "../../../../api/CompanyControllerApi";
import UserControllerApi from "../../../../api/UserControllerApi";
// @ts-ignore
import Select from 'react-select';
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {useHistory, useRouteMatch} from "react-router-dom";
import {ONBOARDING_PATH} from "../../../../routes/Routes";
import {SuccessModal} from "../../../GenericComponents/SuccessModal/SuccessModal";
import {ErrorCard} from "../../../GenericComponents/ErrorCard/ErrorCard";
import {asyncPipe} from "../../../../utils/basicUtils";


const mapState = () => (
    {
    }
);

const mapDispatch = {
    addSuccessMessage,
    addErrorMessage,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};

export const OnboardingPage = (props: Props) => {
    const {t} = useTranslation();
    const {register, handleSubmit, errors} = useForm<TotalOnboardingRequest>();
    const [passwordVisibility, setPasswordVisibility] = React.useState<boolean>(false);
    const [submitted, setSubmitted] = React.useState<boolean>(false);
    const [invitedCompany, setInvitedCompany] = React.useState<CompanyPresentable>();
    const [roles, setRoles] = React.useState<Role[]>([]);
    const [roleSelected, setRoleSelected] = React.useState<{ value: Role | undefined, label: string }>({
        value: undefined,
        label: t("placeholders.onboarding.role")
    });
    const [countries, setCountries] = React.useState<Country[]>([]);
    const [countrySelected, setCountrySelected] = React.useState<{ value: Country | undefined, label: string }>({
        value: undefined,
        label: t("placeholders.country")
    });
    const [successOnboarding, setSuccessOnboarding] = React.useState<boolean>(false);
    const [isTokenWrong, setIsTokenWrong] = React.useState<boolean>(false);
    const [successModalVisibile, setSuccessModalVisible] = React.useState<boolean>(false);

    const [isCompanyOnboarding, setIsCompanyOnboarding] = React.useState<boolean>(true);
    // @ts-ignore
    const token = useRouteMatch(ONBOARDING_PATH)?.params.token;
    // @ts-ignore
    const onboardingType = useRouteMatch(ONBOARDING_PATH)?.params.type;


    const history = useHistory();

    const togglePasswordVisibility = () => setPasswordVisibility(v => !v);

    const loadCompanyInformation = async () => {
        const company = await loadInvitedCompany();
        await loadCountries();
        await loadRoles(company?.companyName);
    }

    const loadRoles = async (invitedCompanyName: string | undefined) => {
        try {
            if (invitedCompanyName){
                const resp = await InfoControllerApi.getCompanyRoles({
                    invitedCompanyName: invitedCompanyName
                });
                setRoles(resp);
            }
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.roles")}: ${error}`);
        }
    }

    const loadCountries = async () => {
        try {
            const resp = await InfoControllerApi.getAllCountries();
            setCountries(resp);
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.countries")}: ${error}`);
        }
    }

    const loadInvitedCompany = async () => {
        try {
            const resp = await CompanyControllerApi.getCompanyFromToken({token: token});
            setInvitedCompany(resp);
            return resp;
        } catch (error) {
            setIsTokenWrong(true);
            props.addErrorMessage(`${t("popups.errors.invited_company")}: ${error}`);
            return null;
        }
    }

    const checkUserToken = async () => {
        try {
            const resp = await UserControllerApi.checkUserTokenExists({token: token});
            if (resp.toString() === "false")
                setIsTokenWrong(true);
        }
        catch (error) {
            setIsTokenWrong(true);
            props.addErrorMessage(`${t("popups.errors.token_onboarding")}: ${error}`);
        }
    }

    const handleOnboarding = async (onboarding: TotalOnboardingRequest) => {
        setSubmitted(true);
        if (isCompanyOnboarding){
            if ((roleSelected.value || invitedCompany?.role) && countrySelected.value) {
                try {
                    onboarding.companyRole = roleSelected.value !== undefined ? roleSelected.value : invitedCompany?.role;
                    onboarding.companyCountry = countrySelected.value;
                    await CompanyControllerApi.postCompanyOnboarding({
                        token: token,
                        totalOnboardingRequest: onboarding
                    });
                    props.addSuccessMessage(t("popups.success.company_onboarding"));
                    setSuccessOnboarding(true);
                    setSuccessModalVisible(true);
                } catch (error) {
                    props.addErrorMessage(`${t("popups.errors.onboarding")}: ${error}`);
                }
            }
        }
        else {
            try {
                await UserControllerApi.postUserOnboarding({
                    token: token,
                    userOnboardingRequest: onboarding
                });
                props.addSuccessMessage(t("popups.success.company_onboarding"));
                setSuccessOnboarding(true);
                setSuccessModalVisible(true);
            } catch (error) {
                console.log("error: ", error);
                props.addErrorMessage(`${t("popups.errors.onboarding")}: ${error}`);
            }
        }

    }

    useEffect(() => {
        (async () => {
            if (onboardingType === 'user') {
                setIsCompanyOnboarding(false);
                await checkUserToken();
            }
            else {
                await loadCompanyInformation();
            }
        })();
    }, []);

    return (
        <>
            <h1>{t("login.title")}</h1>
            <aside className={styles.Center}>
                <img alt="unece-logo" src={UNECELogo} className={styles.Image}/>
            </aside>
            {!successOnboarding && !isTokenWrong ?
                <Jumbotron className={styles.Container}>
                    <Form className={styles.Form} onSubmit={handleSubmit(handleOnboarding)}>
                        {isCompanyOnboarding &&
                            <div className={styles.CompanyContainer}>
                                <div className={styles.TitleArea}>
                                    <h1>{t("onboarding.company_registration")}</h1>
                                </div>
                                <div className={styles.CompanyArea}>
                                    <Form.Group className={styles.NameArea}>
                                        <Form.Label>{t("name")}</Form.Label>
                                        <Form.Control name="companyName" ref={register({required: true})} type="text" defaultValue={invitedCompany?.companyName}/>
                                        {
                                            errors.companyName &&
                                            <div className={styles.ErrorText}>{t("errors.company_name_mandatory")} </div>
                                        }
                                    </Form.Group>
                                    <Form.Group className={styles.CodeArea}>
                                        <Form.Label>{t("code")}</Form.Label>
                                        <Form.Control name="companyCode" ref={register({required: true})} type="text" defaultValue={""}
                                                      placeholder={t("placeholders.code")}/>
                                        {
                                            errors.companyCode &&
                                            <div className={styles.ErrorText}>{t("errors.company_name_mandatory")} </div>
                                        }
                                    </Form.Group>
                                    <Form.Group className={styles.RoleArea}>
                                        <Form.Label>{t("role")}</Form.Label>
                                        { invitedCompany?.role ?
                                            <Form.Control name="role" type="text" value={invitedCompany.role.name} disabled />
                                            :
                                            <Select
                                                value={roleSelected}
                                                onChange={setRoleSelected}
                                                options={roles.map(r => ({value: r, label: r.name}))}
                                            />
                                        }
                                        {
                                            submitted && (roleSelected.value === undefined && invitedCompany?.role === undefined) &&
                                            <div className={styles.ErrorText}>{t("errors.role_mandatory")}</div>
                                        }
                                    </Form.Group>
                                    <Form.Group className={styles.WebsiteArea}>
                                        <Form.Label>{t("website")}</Form.Label>
                                        <Form.Control name="companyWebsite" ref={register({required: false})} type="text" defaultValue={""}
                                                      placeholder={t("placeholders.company_website")}/>
                                    </Form.Group>
                                    <Form.Group className={styles.CountryArea}>
                                        <Form.Label>{t("country")}</Form.Label>
                                        <Select
                                            value={countrySelected}
                                            onChange={setCountrySelected}
                                            options={countries.map(c => ({value: c, label: c.code + " - " + c.name}))}
                                        />
                                        {
                                            submitted && countrySelected.value === undefined &&
                                            <div className={styles.ErrorText}>{t("errors.country_mandatory")}</div>
                                        }
                                    </Form.Group>
                                    <Form.Group className={styles.StateArea}>
                                        <Form.Label>{t("state")}</Form.Label>
                                        <Form.Control name="companyState" ref={register({required: false})} type="text" defaultValue={""}
                                                      placeholder={t("placeholders.state")}/>
                                    </Form.Group>
                                    <Form.Group className={styles.CityArea}>
                                        <Form.Label>{t("city")}</Form.Label>
                                        <Form.Control name="companyCity" ref={register({required: true})} type="text" defaultValue={""}
                                                      placeholder={t("placeholders.city")}/>
                                        {
                                            errors.companyCity &&
                                            <div className={styles.ErrorText}>{t("errors.company_city_mandatory")} </div>
                                        }
                                    </Form.Group>
                                    <Form.Group className={styles.AddressArea}>
                                        <Form.Label>{t("address")}</Form.Label>
                                        <Form.Control name="companyAddress" ref={register({required: false})} type="text" defaultValue={""}
                                                      placeholder={t("placeholders.address")}/>
                                    </Form.Group>
                                    <Form.Group className={styles.LatitudeArea}>
                                        <Form.Label>{t("latitude")}</Form.Label>
                                        <Form.Control name="companyLatitude" ref={register({required: false})} type="number" step="0.00001" defaultValue={""} placeholder={t("placeholders.latitude")}/>
                                    </Form.Group>
                                    <Form.Group className={styles.LongitudeArea}>
                                        <Form.Label>{t("longitude")}</Form.Label>
                                        <Form.Control name="companyLongitude" ref={register({required: false})} type="number" step="0.00001" defaultValue={""} placeholder={t("placeholders.longitude")}/>
                                    </Form.Group>
                                </div>
                            </div>
                        }

                        <div className={styles.UserContainer}>
                            <div className={styles.TitleArea}>
                                <h1>{t("onboarding.user_registration")}</h1>
                            </div>
                            <div className={styles.UserArea}>
                                <Form.Group className={styles.FirstnameArea}>
                                    <Form.Label>{t("user.firstname")}</Form.Label>
                                    <Form.Control name="userFirstName" ref={register({required: true})} type="text" defaultValue={""} placeholder={t("placeholders.user.firstname")}/>
                                    {
                                        errors.userFirstName &&
                                        <div className={styles.ErrorText}>{t("errors.user.firstname")} </div>
                                    }
                                </Form.Group>
                                <Form.Group className={styles.LastnameArea}>
                                    <Form.Label>{t("user.lastname")}</Form.Label>
                                    <Form.Control name="userLastName" ref={register({required: true})} type="text" defaultValue={""} placeholder={t("placeholders.user.lastname")}/>
                                    {
                                        errors.userLastName &&
                                        <div className={styles.ErrorText}>{t("errors.user.lastname")} </div>
                                    }
                                </Form.Group>
                                <Form.Group className={styles.EmailAddressArea}>
                                    <Form.Label>{t("email")}</Form.Label>
                                    <Form.Control name="userEmailAddress" ref={register({required: true})} type="email" defaultValue={""} placeholder={t("placeholders.user.email")}/>
                                    {
                                        errors.userEmailAddress &&
                                        <div className={styles.ErrorText}>{t("errors.email_mandatory")} </div>
                                    }
                                </Form.Group>
                                <Form.Group className={styles.PhoneNumberArea}>
                                    <Form.Label>{t("user.phone_number")}</Form.Label>
                                    <Form.Control name="userPhoneNumber" ref={register({required: false})} type="text" defaultValue={""} placeholder={t("placeholders.user.phone_number")}/>
                                </Form.Group>
                                <Form.Group className={styles.StateArea}>
                                    <Form.Label>{t("state")}</Form.Label>
                                    <Form.Control name="userState" ref={register({required: false})} type="text" defaultValue={""} placeholder={t("placeholders.state")}/>
                                </Form.Group>
                                <Form.Group className={styles.CityArea}>
                                    <Form.Label>{t("city")}</Form.Label>
                                    <Form.Control name="userCity" ref={register({required: false})} type="text" defaultValue={""} placeholder={t("placeholders.city")}/>
                                </Form.Group>
                                <Form.Group className={styles.ZipCodeArea}>
                                    <Form.Label>{t("zip_code")}</Form.Label>
                                    <Form.Control name="userZipCode" ref={register({required: false})} type="text" defaultValue={""} placeholder={t("placeholders.zip_code")}/>
                                </Form.Group>

                                <Form.Group className={styles.Address1Area}>
                                    <Form.Label>{t("address")}</Form.Label>
                                    <Form.Control name="userAddress1" ref={register({required: false})} type="text" defaultValue={""} placeholder={t("placeholders.user.address")}/>
                                </Form.Group>
                            </div>
                        </div>
                        <div className={styles.LoginContainer}>
                            <div className={styles.TitleArea}>
                                <h1>{t("onboarding.login_registration")}</h1>
                            </div>
                            <div className={styles.LoginArea}>
                                <Form.Group className={styles.UsernameArea}>
                                    <Form.Label>{t("username")}</Form.Label>
                                    <Form.Control name="username" ref={register({required: true})} type="text" defaultValue={""} placeholder={t("username")}/>
                                    {
                                        errors.username &&
                                        <div className={styles.ErrorText}>{t("errors.login.username")} </div>
                                    }
                                </Form.Group>
                                <Form.Group className={styles.PasswordArea}>
                                    <Form.Label>{t("password")}</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={passwordVisibility ? 'text' : 'password'}
                                            placeholder={t("placeholders.user.password")}
                                            name="password"
                                            ref={register({required: true})}
                                        />
                                        <InputGroup.Text className={styles.ShowPassword} onClick={togglePasswordVisibility}>{passwordVisibility ?
                                            <AiFillEye size="1.3em"/> : <AiFillEyeInvisible size="1.3em"/>}</InputGroup.Text>
                                    </InputGroup>
                                    {
                                        errors.password &&
                                        <div className={styles.ErrorText}>{t("errors.login.password")} </div>
                                    }
                                </Form.Group>

                            </div>
                        </div>

                        <Button className={styles.ConfirmArea} variant="primary" type="submit">
                            {t("confirm")}
                        </Button>
                    </Form>
                </Jumbotron>
                :
                isTokenWrong ?
                    <ErrorCard title={t("cannot_access")} >
                        <p>{t("errors.onboarding.wrong_token")}</p>
                    </ErrorCard>
                    :
                    <SuccessModal
                        show={successModalVisibile} handleClose={() => setSuccessModalVisible(false)}
                        handleConfirm={() => history.push("/login")} title={t("onboarding.success_title")} buttonText={t("onboarding.modal_proceed")}
                    >
                        <>
                            <p>{t("onboarding.success_company")}</p>
                            <p>{t("onboarding.success_user")}</p>
                            <p>{t("onboarding.success_proceed")}</p>
                        </>
                    </SuccessModal>

            }
        </>
    );
};

export default connector(OnboardingPage);