import {RootState} from "../../../../../../redux/store";
import {addErrorMessage} from "../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import styles from "../Table.module.scss"
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import TradeControllerApi from "../../../../../../api/TradeControllerApi";
import moment from 'moment';
import {useHistory} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {ConfirmationTradePresentable} from "@unece/cotton-fetch";
import {selectCompanyIndustrialSector} from "../../../../../../redux/store/stateSelectors";
import {useTranslation} from "react-i18next";
import {TableTradePresentable} from "../../../../../../../clients/unece-cotton-fetch";

const mapState = (state: RootState) => ({
    companyIndustrialSector: selectCompanyIndustrialSector(state)
});
const mapDispatch = {
    addErrorMessage,
    startLoading,
    stopLoading
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    //TradeTable props
};
type TradeRow = TableTradePresentable & {
    materials: string
    type: string
}
export const TradeTable = (props: Props) => {
    const history = useHistory();
    const [trades, setTrades] = React.useState<TradeRow[]>([]);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const { t } = useTranslation();

    React.useEffect(() => {
        loadData();
        // eslint-disable-next-line
    }, []);

    const loadData = async () => {
        try {
            props.startLoading(t("popups.loading.trades"));
            const contracts = await TradeControllerApi.getContracts();
            const orders = await TradeControllerApi.getOrders();
            const shippings = await TradeControllerApi.getShippings();

            const tradeList: TradeRow[] = [];
            contracts?.forEach(c => {
                if (c.positions && c.positions.length > 0){
                    let materials = (c.positions.map(p => p.contractorMaterialName)).join(", ");
                    tradeList.push({
                        materials: materials,
                        type: 'Contract',
                        ...c
                    });
                }
            });

            orders?.forEach(o => {
                if (o.positions && o.positions.length > 0){
                    let materials = (o.positions.map(p => p.contractorMaterialName)).join(", ");
                    tradeList.push({
                        materials: materials,
                        type: 'Order',
                        ...o
                    });
                }
            });
            shippings?.forEach(s => {
                if (s.positions && s.positions.length > 0){
                    let materials = (s.positions.map(p => p.contractorMaterialName)).join(", ");
                    tradeList.push({
                        materials: materials,
                        type: 'Shipping',
                        ...s
                    });
                }
            });

            // @ts-ignore
            tradeList.sort((a,b) => b.contractorDate?.getTime() - a.contractorDate?.getTime());
            setTrades(tradeList);
        } catch(e) {
            props.addErrorMessage(t("popups.errors.trades"));
            console.error(e)
        } finally {
            props.stopLoading();
        }
    }

    let columns = [{
        dataField: 'contractorReferenceNumber',
        text: t("reference_number"),
        sort: true
    }, {
        dataField: 'documentType',
        text: t("document_type"),
        sort: true
    },{
        dataField: 'contractorName',
        text: t("contractor_name"),
        sort: true
    }, {
        dataField: 'consigneeName',
        text: t("consignee_name"),
        sort: true,
    }, {
        dataField: 'validFrom',
        text: t("valid_from"),
        sort: true,
        formatter: (cell: any) => moment(cell).format("YYYY-MM-DD")
    }, {
        dataField: 'materials',
        text: t("materials"),
        sort: true
    }, {
        dataField: 'status',
        text: t("status"),
        sort: true,
    }];
    if(isTabletOrMobile)
        columns = columns.filter((item, index) => [0, 2, 3, 6].includes(index))

    return (
        <div className={styles.Card}>
            <h4 className={styles.Title}>{t("tables.trade_title")}</h4>
            <div className={styles.Content}>
                <GenericDataTable
                    data={trades}
                    columns={columns}
                    onRowClick={(e: any, row: any, rowIndex: any) => {
                        history.push('/' + props.companyIndustrialSector + '/trades/'+row.id+'/confirmation?type='+row.type.toLowerCase());
                    }}/>
            </div>
        </div>
    )
}
export default connector(TradeTable);
