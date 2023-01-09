import {RootState} from "../../../../redux/store";
import {selectUserLoggedIn} from "../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../redux/store/Messages/actions";
import {connect, ConnectedProps} from "react-redux";
import {Button, Form, Jumbotron} from "react-bootstrap";
import styles from "./UserPage.module.scss";
import React from "react";
import {useForm} from "react-hook-form";
import {UserOnboardingRequest, UserRequest} from "@unece/cotton-fetch";
import UserControllerApi from '../../../../api/UserControllerApi';
import {useHistory} from "react-router-dom";
import {setUserLoggedIn} from "../../../../redux/store/UserLoggedIn/actions";
import {useTranslation} from "react-i18next";
import {Modal} from "../../../GenericComponents/Modal/Modal";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state),
    }
);

const mapDispatch = {
    addSuccessMessage,
    addErrorMessage,
    setUserLoggedIn
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    handleLogout: () => void
};

export const UserPage = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const {register, handleSubmit, errors} = useForm<UserRequest>();
    const {register: invRegister, errors: invErrors, handleSubmit: invHandleSubmit} = useForm<UserOnboardingRequest>();
    const [isChangePassword, setIsChangePassword] = React.useState<boolean>(false);
    const [oldPassword, setOldPassword] = React.useState<string>("");
    const [newPassword, setNewPassword] = React.useState<string>("");
    const [newPasswordConfirm, setNewPasswordConfirm] = React.useState<string>("");
    const [oldPasswordError, setOldPasswordError] = React.useState<boolean>(false);
    const [newPasswordError, setNewPasswordError] = React.useState<boolean>(false);

    const [invitationModalVisible, setInvitationModalVisible] = React.useState<boolean>(false);

    const handleChange = async (user: UserRequest) => {
        try {
            const passwordMatch = await UserControllerApi.checkPassword({
                value: oldPassword
            });
            // @ts-ignore
            if (passwordMatch === 'true' || oldPassword === "") {
                setOldPasswordError(false);
                if (newPassword === newPasswordConfirm) {
                    setNewPasswordError(false);
                    await UserControllerApi.updateUser({
                        userRequest: user
                    });
                    props.setUserLoggedIn({
                        ...user,
                        company: props.userLoggedIn?.company,
                        country: props.userLoggedIn?.country,
                        address2: props.userLoggedIn?.address2,
                        language: props.userLoggedIn?.language,
                        department: props.userLoggedIn?.department,
                        subDepartment: props.userLoggedIn?.subDepartment,
                        role: props.userLoggedIn?.role,
                        registrationDate: props.userLoggedIn?.registrationDate,
                        lastEditDate: props.userLoggedIn?.lastEditDate
                    });
                    props.addSuccessMessage(t("popups.success.user_update"));
                    history.push("/");
                } else {
                    setNewPasswordError(true);
                }
            } else {
                setOldPasswordError(true);
            }
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.user_update")}: ${error}`);
        }
    };

    const addInvitedUser = async (userInviteRequest: UserOnboardingRequest) => {
        try {
            await UserControllerApi.userInvitation({
                userOnboardingRequest: userInviteRequest
            });
            props.addSuccessMessage(t("popups.success.colleague_invitation"));
            history.push("/");
        }
        catch (error){
            props.addErrorMessage(`${t("popups.errors.colleague_invitation")}: ${error}`);
        }
    }

    return (

        <>
            <Modal show={invitationModalVisible} handleClose={() => setInvitationModalVisible(false)} handleConfirm={invHandleSubmit(addInvitedUser)} title={t("user.colleague_invitation")} >
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{t("user.firstname")}</Form.Label>
                        <Form.Control name="userFirstName" type="text" ref={invRegister({required: true})} placeholder={t("placeholders.user.firstname")}/>
                        {
                            invErrors.userFirstName && invErrors.userFirstName.type === "required" &&
                            <div className={styles.ErrorText}>{t("errors.user.firstname")}</div>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t("user.lastname")}</Form.Label>
                        <Form.Control name="userLastName" type="text" ref={invRegister({required: true})} placeholder={t("placeholders.user.lastname")}/>
                        {
                            invErrors.userLastName && invErrors.userLastName.type === "required" &&
                            <div className={styles.ErrorText}>{t("errors.user.lastname")}</div>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t("user_email")}</Form.Label>
                        <Form.Control name="userEmailAddress" type="email" ref={invRegister({required: true})} placeholder={t("placeholders.trade.company_user_invitation")}/>
                        <Form.Text className="text-muted">{t("company_invitation_hint")}</Form.Text>
                        {
                            invErrors.userEmailAddress && invErrors.userEmailAddress.type === "required" &&
                            <div className={styles.ErrorText}>{t("errors.email_mandatory")}</div>
                        }
                    </Form.Group>
                </Form>
            </Modal>
            <Jumbotron className={styles.Container}>
                <div className={styles.Header}>
                    <h2>{t("user.title")}</h2>
                    <Button
                        variant="outline-danger"
                        onClick={props.handleLogout}
                    >
                        {t("logout")}
                    </Button>
                </div>
                <Form className={styles.Form} onSubmit={handleSubmit(handleChange)} >
                    <Form.Group className={styles.FirstnameArea}>
                        <Form.Label>{t("user.firstname")}</Form.Label>
                        <Form.Control name="firstname" ref={register({required: true})} type="text" defaultValue={props.userLoggedIn?.firstname} placeholder={t("placeholders.user.firstname")}/>
                        {
                            errors.firstname && errors.firstname.type === "required" &&
                            <div className={styles.ErrorText}>{t("errors.user.firstname")}</div>
                        }
                    </Form.Group>
                    <Form.Group className={styles.LastnameArea}>
                        <Form.Label>{t("user.lastname")}</Form.Label>
                        <Form.Control name="lastname" ref={register({required: true})} type="text" defaultValue={props.userLoggedIn?.lastname} placeholder={t("placeholders.user.lastname")}/>
                        {
                            errors.lastname && errors.lastname.type === "required" &&
                            <div className={styles.ErrorText}>{t("errors.user.lastname")}</div>
                        }
                    </Form.Group>

                    <Form.Group className={styles.EmailArea}>
                        <Form.Label>{t("email")}</Form.Label>
                        <Form.Control name="email" ref={register({required: true})} type="text"
                                      value={props.userLoggedIn?.email} placeholder={t("placeholders.user.email")} />
                    </Form.Group>
                    <Form.Group className={styles.PasswordArea}>
                        {isChangePassword ?
                            <>
                                <Form.Label>{t("password")}</Form.Label>
                                <Form.Control type="password" onChange={e => setOldPassword(e.target.value)}
                                              placeholder={t("placeholders.user.password")} />
                                <Form.Text className="text-muted font-weight-bold">
                                    {t("user.old_password")}
                                </Form.Text>
                                {
                                    oldPasswordError &&
                                    <div className={styles.ErrorText}>{t("errors.user.wrong_password")}</div>
                                }
                            </>
                            :
                            <Button className={styles.ChangePassword} variant="secondary" type="button"
                                    onClick={() => setIsChangePassword(true)}>
                                {t("user.change_password")}
                            </Button>
                        }
                    </Form.Group>
                    {isChangePassword &&
                    <>
                      <Form.Group className={styles.NewPasswordArea}>
                        <Form.Label>{t("user.new_password")}</Form.Label>
                        <Form.Control type="password" placeholder={t("placeholders.user.password")}
                                      onChange={e => setNewPassword(e.target.value)}/>
                      </Form.Group>
                      <Form.Group className={styles.ConfirmPasswordArea}>
                        <Form.Label>{t("user.confirm_password")}</Form.Label>
                        <Form.Control name="password" ref={register({required: false})} type="password"
                                      placeholder={t("placeholders.user.password_confirm")}
                                      onChange={e => setNewPasswordConfirm(e.target.value)}/>
                          {
                              newPasswordError &&
                              <div className={styles.ErrorText}>{t("errors.user.passwords_match")}</div>
                          }
                      </Form.Group>
                    </>
                    }

                    <Form.Group className={styles.StateArea}>
                        <Form.Label>{t("state")}</Form.Label>
                        <Form.Control name="state" ref={register({required: false})} type="text"
                                      defaultValue={props.userLoggedIn?.state} placeholder={t("placeholders.state")} />
                    </Form.Group>
                    <Form.Group className={styles.CityArea}>
                        <Form.Label>{t("city")}</Form.Label>
                        <Form.Control name="city" ref={register({required: false})} type="text"
                                      defaultValue={props.userLoggedIn?.city} placeholder={t("placeholders.city")} />
                    </Form.Group>

                    <Form.Group className={styles.ZipArea}>
                        <Form.Label>{t("zip_code")}</Form.Label>
                        <Form.Control name="zip" ref={register({required: false})} type="text"
                                      defaultValue={props.userLoggedIn?.zip} placeholder={t("placeholders.zip_code")} />
                    </Form.Group>
                    <Form.Group className={styles.PhoneArea}>
                        <Form.Label>{t("user.phone_number")}</Form.Label>
                        <Form.Control name="phone" ref={register({required: false})} type="text"
                                      defaultValue={props.userLoggedIn?.phone} placeholder={t("placeholders.user.phone_number")} />
                    </Form.Group>

                    <Form.Group className={styles.Address1Area}>
                        <Form.Label>{`${t("address")} 1`}</Form.Label>
                        <Form.Control name="address1" ref={register({required: false})} type="text"
                                      defaultValue={props.userLoggedIn?.address1} placeholder={`${t("placeholders.address")} 1`} />
                    </Form.Group>
                    <Form.Group className={styles.Address2Area}>
                        <Form.Label>{`${t('address')} 2`}</Form.Label>
                        <Form.Control name="address2" ref={register({required: false})} type="text"
                                      defaultValue={props.userLoggedIn?.address2} placeholder={`${t("placeholders.address")} 2`} />
                    </Form.Group>

                    <Button className={styles.ConfirmArea} variant="primary" type="submit">
                        {t("confirm")}
                    </Button>

                    <Form.Text className={styles.InviteColleague} onClick={() => setInvitationModalVisible(true)}>
                        {t("user.colleague_invitation_hint")}
                    </Form.Text>
                </Form>
            </Jumbotron>
        </>
    );
};

export default connector(UserPage);