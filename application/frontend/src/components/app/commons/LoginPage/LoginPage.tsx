import {RootState} from "../../../../redux/store";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {useForm} from "react-hook-form";
import {LoginRequest} from "@unece/cotton-fetch";
import styles from './LoginPage.module.scss';
import {Button, Form, InputGroup} from "react-bootstrap";
import UNECELogo from "../../../../assets/images/UNECELogo1.png";
import {selectUserLoggedIn} from "../../../../redux/store/stateSelectors";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai"

const mapState = (state: RootState) => ({
    userLoggedIn: selectUserLoggedIn(state),
})

const mapDispatch = {

}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    handleLogin: (login: LoginRequest) => void,
}

export const LoginPage = (props: Props) => {

    const { register, handleSubmit, errors } = useForm<LoginRequest>();
    const [ passwordVisibility, setPasswordVisibility ] = React.useState<boolean>(false);
    const history = useHistory();
    const { t } = useTranslation();

    const togglePasswordVisibility = () => setPasswordVisibility(v => !v);

    React.useEffect(() => {
        //If I am already authenticated, go to homepage
        props.userLoggedIn && history.push("/");
    }, []);

    return (
        <div className={styles.LoginFormContainer}>
            <h1>{t("login.title")}</h1>
            <aside className={styles.Center}>
                <img alt="unece-logo" src={UNECELogo} className={styles.Image}/>
            </aside>
            <Form className={styles.LoginForm} onSubmit={handleSubmit(props.handleLogin)}>
                <Form.Group controlId="formBasicUsername" className={styles.UsernameFormGroup}>
                    <Form.Label>{`${t('username')}:`}</Form.Label>
                    <div>
                        <Form.Control
                            type="text"
                            placeholder={t("username")}
                            name="username"
                            ref={register({required: true})}
                        />
                        {
                            errors.username && errors.username.type === "required" &&
                            <div className={styles.ErrorText}>{t('errors.login.username')}</div>
                        }
                    </div>
                </Form.Group>
                <Form.Group controlId="formBasicPassword" className={styles.PasswordFormGroup}>
                    <Form.Label>Password:</Form.Label>
                    <div>
                        <InputGroup>
                            <Form.Control
                                type={passwordVisibility ? 'text' : 'password'}
                                placeholder={t("password")}
                                name="password"
                                ref={register({required: true})}
                            />
                            <InputGroup.Text className={styles.ShowPassword} onClick={togglePasswordVisibility}>{passwordVisibility ? <AiFillEye size="1.3em"/> : <AiFillEyeInvisible size="1.3em"/>}</InputGroup.Text>
                        </InputGroup>

                        {
                            errors.password && errors.password.type === "required" &&
                            <div className={styles.ErrorText}>{t('errors.login.password')}</div>
                        }
                    </div>
                </Form.Group>
                <Button variant="primary" type="submit" className={styles.SubmitButton}>
                    {t("signin")}
                </Button>
            </Form>
        </div>
    );
}

export default connector(LoginPage)
