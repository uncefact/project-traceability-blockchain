import {RootState} from "../../../../../../redux/store";
import {addErrorMessage} from "../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import styles from "../Table.module.scss"
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import TransformationPlanControllerApi from "../../../../../../api/TransformationPlanControllerApi";
import {TransformationPlanPresentable} from "@unece/cotton-fetch";
import {selectCompanyIndustrialSector, selectUserLoggedIn} from "../../../../../../redux/store/stateSelectors";
import moment from "moment";
import {useHistory} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {useTranslation} from "react-i18next";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state),
        companyIndustrialSector: selectCompanyIndustrialSector(state)
    }
);
const mapDispatch = {
    addErrorMessage,
    startLoading,
    stopLoading
};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
};
export const TransformationPlanTable = (props: Props) => {
    const history = useHistory();
    const [transformationPlans, setTransformationPlans] = React.useState<TransformationPlanPresentable[]>([]);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const { t } = useTranslation();

    React.useEffect(() => {
        loadData();
        // eslint-disable-next-line
    }, []);

    const loadData = async () => {
        try {
            props.startLoading(t("popups.loading.transformations"));

            const transformations = await TransformationPlanControllerApi.getAllMyTransformationPlans();
            // @ts-ignore
            transformations.sort((a,b) => b.creationDate?.getTime() - a.creationDate?.getTime());
            setTransformationPlans(transformations);
        } catch(e) {
            props.addErrorMessage(t("popups.errors.transformations"));
        } finally {
            props.stopLoading();
        }
    }

    let columns = [{
        dataField: 'name',
        text: t("name"),
        sort: true
    }, {
        dataField: 'outputMaterial.name',
        text: t("material_name"),
        sort: true
    },{
        dataField: 'validFrom',
        text: t("valid_from"),
        sort: true,
        formatter: (cell: any) => moment(cell).format("YYYY-MM-DD")
    }, {
        dataField: 'validUntil',
        text: t("valid_until"),
        sort: true,
        formatter: (cell: any) => cell != null ? moment(cell).format("YYYY-MM-DD") : ""
    }];
    if(isTabletOrMobile)
        columns = columns.filter((item, index) => [0, 1].includes(index))

    return (
        <div className={styles.Card}>
            <h4 className={styles.Title}>{t("tables.transformation_title")}</h4>
            <div className={styles.Content}>
                <GenericDataTable
                    data={transformationPlans}
                    columns={columns}
                    onRowClick={(e: any, row: any, rowIndex: any) => {
                        history.push('/' + props.companyIndustrialSector + '/transformationPlans/'+row.id);
                    }}/>
            </div>
        </div>
    )
}
export default connector(TransformationPlanTable);
