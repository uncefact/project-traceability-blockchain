import React from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable, {ColumnDescription} from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import styles from './GenericDataTable.module.scss'
import {useTranslation} from "react-i18next";

const { SearchBar } = Search;
const pagination = paginationFactory({
    paginationSize: 4,
    pageStartIndex: 1,
    hideSizePerPage: true,
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    sizePerPageList: [{
        text: '25', value: 25
    }]
});

type Props = {
    data: any[],
    columns: ColumnDescription<any, any>[],
    onRowClick?: (e: any, row: any, rowIndex: any) => void
};

export default (props: Props) => {
    const { t } = useTranslation();
    const rowEvents = {
        onClick: props.onRowClick
    }
    return (
        <ToolkitProvider
            keyField="keyField"
            data={ props.data }
            columns={ props.columns }
            search
            bootstrap4
        >
            {
                props => (
                    <div>
                        <div className={styles.SearchBarContainer}>
                            <SearchBar { ...props.searchProps } className={styles.SearchBar}/>
                        </div>
                        <BootstrapTable
                            striped
                            hover
                            condensed
                            pagination={ pagination }
                            rowEvents={ rowEvents }
                            noDataIndication={t("table_empty")}
                            { ...props.baseProps }
                        />
                    </div>
                )
            }
        </ToolkitProvider>
    )
}
