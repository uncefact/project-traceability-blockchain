import React, {useEffect} from "react";
import {
    ConfirmationCertificationPresentable,
    ConfirmationCertificationPresentableStatusEnum,
} from "@unece/cotton-fetch";
import CertificationControllerApi from "../../../../../../../api/CertificationControllerApi";
import {useRouteMatch} from "react-router-dom";
import {selectUserLoggedIn} from "../../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../../redux/store/Messages/actions";
import MaterialCertificationConfirm from "../../confirm/MaterialCertificationConfirm/MaterialCertificationConfirm";
import {CertificationConfirmation} from "../../confirm/CertificationConfirmation";
import {RootState} from "../../../../../../../redux/store";
import {connect, ConnectedProps} from "react-redux";
import {startLoading, stopLoading} from "../../../../../../../redux/store/Loading/actions";
import {CertificationViewer} from "../../view/CertificationViewer";
import MaterialCertificationView from "../../view/MaterialCertificationView/MaterialCertificationView";
import {useTranslation} from "react-i18next";
import {MATERIAL_CERTIFICATION_CONFIRMATION_PATH} from "../../../../../../../routes/Routes";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state)
    }
);

const mapDispatch = {
    addErrorMessage,
    addSuccessMessage,
    startLoading,
    stopLoading
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
};

export const MaterialCertificationHandler = (props: Props) => {
    const { t } = useTranslation();
    const match = useRouteMatch('/:companyIndustry' + MATERIAL_CERTIFICATION_CONFIRMATION_PATH);
    const [certification, setCertification] = React.useState<ConfirmationCertificationPresentable>();
    const [isView, setIsView] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    // @ts-ignore
    const idParam = match?.params.id;

    const isViewOrConfirmation = async () => {
        let resp: ConfirmationCertificationPresentable;
        try {
            props.startLoading(t("popups.loading.material_certification"));
            resp = await CertificationControllerApi.getCertification({id: idParam});

            checkIfUserCannotConfirm(resp);

            setCertification(resp);
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            setIsView(true);
            setIsLoading(false);
            props.addErrorMessage(`${t("popups.errors.material_certification")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    };

    const checkIfUserCannotConfirm = (certification: ConfirmationCertificationPresentable | undefined) => {
        const loggedUser = props.userLoggedIn;
        // a user can confirm if it is part of a consignee company
        if (certification?.approverName !== loggedUser?.company?.companyName || certification?.status !== ConfirmationCertificationPresentableStatusEnum.Pending) {
            setIsView(true);
        }

    };

    useEffect(() => {
        (async () => {
            await isViewOrConfirmation();
        })();
    }, []);

    if (!isLoading){
        if (isView) {
            return (
                <CertificationViewer component={MaterialCertificationView} certification={certification} />
            );
        }
        return (
            <CertificationConfirmation component={MaterialCertificationConfirm} certification={certification} />
        );
    }
    return (<div>{`${t("loading")}...`}</div>);


};

export default connector(MaterialCertificationHandler);
