import React, {useEffect} from "react";
import {RootState} from "../../../../../../redux/store";
import {selectUserLoggedIn} from "../../../../../../redux/store/stateSelectors";
import {addErrorMessage, addSuccessMessage} from "../../../../../../redux/store/Messages/actions";
import {connect, ConnectedProps} from "react-redux";
import TradeControllerApi from "../../../../../../api/TradeControllerApi";
import {useHistory, useLocation, useRouteMatch} from "react-router-dom";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {ConfirmationTradePresentable, ConfirmationTradePresentableStatusEnum} from "@unece/cotton-fetch";
import TradeConfirm from "../confirm/TradeConfirm/TradeConfirm";
import TradeView from "../view/TradeView/TradeView";
import {useTranslation} from "react-i18next";
import {TRADE_CONFIRMATION_PATH} from "../../../../../../routes/Routes";

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

export const TradeHandler = (props: Props) => {
    const history = useHistory();
    const { t } = useTranslation();
    const tradeType = new URLSearchParams(useLocation().search).get("type");
    const match = useRouteMatch('/:companyIndustry' + TRADE_CONFIRMATION_PATH);
    const [trade, setTrade] = React.useState<ConfirmationTradePresentable>();
    const [isView, setIsView] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    // @ts-ignore
    const idParam = match?.params.id;

    const isViewOrConfirmation = async () => {
        let resp: ConfirmationTradePresentable;
        try {
            props.startLoading(t("popups.loading.trade"));
            switch (tradeType) {
                case "contract":
                    resp = await TradeControllerApi.getContractById({id: idParam});
                    break;
                case "order":
                    resp = await TradeControllerApi.getOrderById({id: idParam});
                    break;
                case "shipping":
                    resp = await TradeControllerApi.getShippingById({id: idParam});
                    break;
                default:
                    setIsView(true);
                    props.addErrorMessage(t("popups.errors.trade_type"));
                    return;
            }
            checkIfUserCannotConfirm(resp);

            setTrade(resp);
            setIsLoading(false);
        } catch (error) {
            setIsView(true);
            setIsLoading(false);
            if (error.status === 403) {
                history.push("/");
                props.addErrorMessage(t("popups.errors.trade_permission"));
                return
            }
            props.addErrorMessage(`${t("popups.errors.trade")}: ${error}`);
        } finally {
            props.stopLoading();
        }
    };

    const checkIfUserCannotConfirm = (trade: ConfirmationTradePresentable) => {
        const loggedUser = props.userLoggedIn;
        // a user can confirm if it is part of a consignee company
        if (trade.status !== ConfirmationTradePresentableStatusEnum.Pending || trade.approverName !== loggedUser?.company?.companyName) {
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
                <TradeView {...props} trade={trade}/>
            );
        }
        return (
            <TradeConfirm {...props} trade={trade} />
        );
    }

    return (<div>{`${t("loading")}...`}</div>);
}

export default connector(TradeHandler);
