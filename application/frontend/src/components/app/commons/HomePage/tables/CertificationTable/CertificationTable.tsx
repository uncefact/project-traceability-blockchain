import {RootState} from "../../../../../../redux/store";
import {addErrorMessage} from "../../../../../../redux/store/Messages/actions";
import {startLoading, stopLoading} from "../../../../../../redux/store/Loading/actions";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import styles from "../Table.module.scss"
import GenericDataTable from "../../../../../GenericComponents/GenericDataTable/GenericDataTable";
import CertificationControllerApi from "../../../../../../api/CertificationControllerApi";
import {useHistory} from "react-router-dom";
import {selectCompanyIndustrialSector, selectUserLoggedIn} from "../../../../../../redux/store/stateSelectors";
import moment from "moment";
import {useMediaQuery} from "react-responsive";
import {
    ConfirmationCertificationPresentable,
    TableCertificationPresentableSubjectEnum
} from "@unece/cotton-fetch";
import {useTranslation} from "react-i18next";
import {TableCertificationPresentable} from "../../../../../../../clients/unece-cotton-fetch";

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

type CertificationRow = TableCertificationPresentable & {
    type: string,
    certificationEntity?: string
}

export const CertificationTable = (props: Props) => {
    const history = useHistory();
    const [certifications, setCertifications] = React.useState<CertificationRow[]>([]);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const { t } = useTranslation();

    React.useEffect(() => {
        loadData();
        // eslint-disable-next-line
    }, []);

    const loadData = async () => {
        try {
            props.startLoading(t("popups.loading.certifications"));

            const certs = await CertificationControllerApi.getMyCertifications();
            const rows : CertificationRow[] = [];
            certs.forEach(c => {
                if (c.subject === TableCertificationPresentableSubjectEnum.Scope)
                    rows.push({ type: 'Scope', ...c });
                else if (c.subject === TableCertificationPresentableSubjectEnum.Transaction)
                    rows.push({ type: 'Transaction', ...c });
                else if (c.subject === TableCertificationPresentableSubjectEnum.Material)
                    rows.push({ type: 'Material', ...c });
                else if (c.subject === TableCertificationPresentableSubjectEnum.Self)
                    rows.push({ type: 'Self', ...c });
            });

            rows.forEach(c => props.userLoggedIn?.company?.companyName === c.contractorName ? c.certificationEntity = c.consigneeName : c.certificationEntity = c.contractorName);
            // @ts-ignore
            rows.sort((a,b) => b.contractorDate?.getTime() - a.contractorDate?.getTime());
            setCertifications(rows);
        } catch(e) {
            props.addErrorMessage(t("popups.errors.certifications"));
        } finally {
            props.stopLoading();
        }
    };

    let columns = [{
        dataField: 'certificateReferenceNumber',
        text: t('reference_number'),
        sort: true
    }, {
        dataField: 'documentType',
        text: t('document_type'),
        sort: true
    }, {
        dataField: 'assessmentType',
        text: t('assessment_type'),
        sort: true
    }, {
        dataField: 'referencedStandard',
        text: t('reference_standard'),
        sort: true
    }, {
        dataField: 'validFrom',
        text: t('valid_from'),
        sort: true,
        formatter: (cell: any) => moment(cell).format("YYYY-MM-DD")
    }, {
        dataField: 'validUntil',
        text: t('valid_until'),
        sort: true,
        formatter: (cell: any) => cell != null ? moment(cell).format("YYYY-MM-DD") : ""
    }, {
        dataField: 'status',
        text: t('status'),
        sort: true,
    }];
    if(isTabletOrMobile)
        columns = columns.filter((item, index) => [0, 3, 6].includes(index))

    return (
        <div className={styles.Card}>
            <h4 className={styles.Title}>{t("tables.certificate_title")}</h4>
            <div className={styles.Content}>
                <GenericDataTable
                    data={certifications}
                    columns={columns}
                    onRowClick={(e: any, row: any, rowIndex: any) => {
                        history.push('/' + props.companyIndustrialSector + '/certifications/'+row.subject.toLowerCase() + '/' + row.id + '/confirmation');
                    }}
                />
            </div>
        </div>
    )
};

export default connector(CertificationTable);
