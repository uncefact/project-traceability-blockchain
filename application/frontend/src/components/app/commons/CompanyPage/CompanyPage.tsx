import {RootState} from "../../../../redux/store";
import {selectUserLoggedIn} from "../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../redux/store/Messages/actions";
import {connect, ConnectedProps} from "react-redux";
import {Button, Form, Jumbotron} from "react-bootstrap";
import styles from "./CompanyPage.module.scss";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {CompanyRequest, Country} from "@unece/cotton-fetch";
import CompanyControllerApi from '../../../../api/CompanyControllerApi';
import InfoControllerApi from '../../../../api/InfoControllerApi';
import {useHistory} from "react-router-dom";
import {setUserLoggedIn} from "../../../../redux/store/UserLoggedIn/actions";
import {useTranslation} from "react-i18next";
// @ts-ignore
import Select from 'react-select';

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
};

export const CompanyPage = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const {register, handleSubmit, errors} = useForm<CompanyRequest>();

    const [countries, setCountries] = React.useState<Country[]>([]);
    const [countrySelected, setCountrySelected] = React.useState<{ value: Country | undefined, label: string }>({
        value: undefined,
        label: t("placeholders.country")
    });

    const handleUpdate = async (request: CompanyRequest) => {
        try {
            request.country = countrySelected.value?.code;
            const resp = await CompanyControllerApi.updateCompany({
                companyRequest: request
            });
            props.setUserLoggedIn({
                ...props.userLoggedIn,
                company: resp
            });
            props.addSuccessMessage(t("popups.success.company_update"));
            history.push("/");
        }
        catch (error){
            props.addErrorMessage(`${t("popups.errors.company_update")}: ${error}`);
        }
    }

    const loadCountries = async () => {
        try {
            const resp = await InfoControllerApi.getAllCountries();
            setCountries(resp);
            setCountrySelected({value: {
                code: props.userLoggedIn?.company?.country?.code,
                name: props.userLoggedIn?.company?.country?.name},
            label: props.userLoggedIn?.company?.country?.code + " - " + props.userLoggedIn?.company?.country?.name})
        } catch (error) {
            props.addErrorMessage(`${t("popups.errors.countries")}: ${error}`);
        }
    }

    useEffect(() => {
        (async () => {
            await loadCountries();
        })();
    }, []);

    return (
        <Jumbotron className={styles.Container}>
            <div className={styles.Header}>
                <h2>{t("company")}</h2>
            </div>
            <Form className={styles.Form} onSubmit={handleSubmit(handleUpdate)}>
                <Form.Group className={styles.NameArea}>
                    <Form.Label>{t("name")}</Form.Label>
                    <Form.Control name="name" ref={register({required: true})} type="text" defaultValue={props.userLoggedIn?.company?.companyName} placeholder={t("placeholders.name")}/>
                    {
                        errors.name && errors.name.type === "required" &&
                        <div className={styles.ErrorText}>{t("errors.user.firstname")}</div>
                    }
                </Form.Group>
                <Form.Group className={styles.CodeArea}>
                    <Form.Label>{t("code")}</Form.Label>
                    <Form.Control name="code" ref={register({required: true})} type="text" defaultValue={props.userLoggedIn?.company?.companyCode} placeholder={t("placeholders.code")}/>
                    {
                        errors.code && errors.code.type === "required" &&
                        <div className={styles.ErrorText}>{t("errors.user.lastname")}</div>
                    }
                </Form.Group>

                <Form.Group className={styles.StateArea}>
                    <Form.Label>{t("state")}</Form.Label>
                    <Form.Control name="state" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.state} placeholder={t("placeholders.state")} />
                </Form.Group>
                <Form.Group className={styles.CountryArea}>
                    <Form.Label>{t("country")}</Form.Label>
                    <Select
                        value={countrySelected}
                        onChange={setCountrySelected}
                        options={countries.map(c => ({value: c, label: c.code + " - " + c.name}))}
                    />
                </Form.Group>

                <Form.Group className={styles.CityArea}>
                    <Form.Label>{t("city")}</Form.Label>
                    <Form.Control name="city" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.city} placeholder={t("placeholders.city")} />
                </Form.Group>

                <Form.Group className={styles.ZipArea}>
                    <Form.Label>{t("zip_code")}</Form.Label>
                    <Form.Control name="zip" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.zip} placeholder={t("placeholders.zip_code")} />
                </Form.Group>

                <Form.Group className={styles.Address1Area}>
                    <Form.Label>{`${t("address")} 1`}</Form.Label>
                    <Form.Control name="address1" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.address1} placeholder={`${t("placeholders.address")} 1`} />
                </Form.Group>
                <Form.Group className={styles.Address2Area}>
                    <Form.Label>{`${t("address")} 2`}</Form.Label>
                    <Form.Control name="address2" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.address2} placeholder={`${t("placeholders.address")} 2`} />
                </Form.Group>
                
                <Form.Group className={styles.LatitudeArea}>
                    <Form.Label>{t("latitude")}</Form.Label>
                    <Form.Control name="latitude" ref={register({required: false})} type="number" step="0.00001"
                                  defaultValue={props.userLoggedIn?.company?.latitude} placeholder={t("placeholders.latitude")} />
                </Form.Group>

                <Form.Group className={styles.LongitudeArea}>
                    <Form.Label>{t("longitude")}</Form.Label>
                    <Form.Control name="longitude" ref={register({required: false})} type="number" step="0.00001"
                                  defaultValue={props.userLoggedIn?.company?.longitude} placeholder={t("placeholders.longitude")} />
                </Form.Group>
                <Form.Group className={styles.SectorArea}>
                    <Form.Label>{t("sector")}</Form.Label>
                    <Form.Control name="sector" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.companyIndustry?.name} disabled />
                </Form.Group>
                <Form.Group className={styles.WebsiteArea}>
                    <Form.Label>{t("website")}</Form.Label>
                    <Form.Control name="website" ref={register({required: false})} type="text"
                                  defaultValue={props.userLoggedIn?.company?.website} placeholder={t("placeholders.company_website")} />
                </Form.Group>

                <Button className={styles.ConfirmArea} variant="primary" type="submit">
                    {t("confirm")}
                </Button>

            </Form>
        </Jumbotron>
    );
};

export default connector(CompanyPage);