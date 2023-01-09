import {RootState} from "../../../../../../redux/store";
import {addErrorMessage} from "../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import styles from "../Table.module.scss"
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import MaterialControllerApi from "../../../../../../api/MaterialControllerApi";
import {useHistory} from "react-router-dom";
import {MaterialPresentable} from "@unece/cotton-fetch";
import {selectUserLoggedIn} from "../../../../../../redux/store/stateSelectors";
import {useTranslation} from "react-i18next";

const mapState = (state: RootState) => (
    {
        userLoggedIn: selectUserLoggedIn(state)
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
export const InputMaterialTable = (props: Props) => {
    const [inputMaterials, setInputMaterials] = React.useState<MaterialPresentable[]>([]);
    const { t } = useTranslation();

    React.useEffect(() => {
        loadData();
        // eslint-disable-next-line
    }, []);

    const loadData = async () => {
        try {
            props.startLoading(t("popups.loading.input_materials"));

            const materials = await MaterialControllerApi.getMaterialsByCompany({
                    company: props.userLoggedIn?.company?.companyName || "",
                    isInput: true,
                    isForTransformation : false
                }
            );
            setInputMaterials(materials);
        } catch(e) {
            props.addErrorMessage(t("popups.errors.input_material"));
        } finally {
            props.stopLoading();
        }
    }

    const columns = [{
        dataField: 'name',
        text: t("name"),
        sort: true
    }];

    return (
        <div className={styles.Card}>
            <h4 className={styles.Title}>Input materials</h4>
            <div className={styles.Content}>
                <GenericDataTable
                    data={inputMaterials}
                    columns={columns}
                    />
            </div>
        </div>
    )
}
export default connector(InputMaterialTable);
