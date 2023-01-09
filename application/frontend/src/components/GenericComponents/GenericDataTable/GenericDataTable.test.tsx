import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import {mocked} from "ts-jest/utils";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import GenericDataTable from "./GenericDataTable";

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-bootstrap-table-next', () => {
    let BootstrapTable = jest.fn().mockImplementation(({children}) => <div className={'BootstrapTable'}>{children}</div>);
    // @ts-ignore
    BootstrapTable.ColumnDescription = {
        test: String
    }
    return BootstrapTable;
});
jest.mock('react-bootstrap-table2-toolkit', () => {
    let ToolkitProvider = jest.fn().mockImplementation(({children}) => <div className={'ToolkitProvider'}>{children({
        searchProps: null
    })}</div>);
    // @ts-ignore
    ToolkitProvider.Search = {
        SearchBar: jest.fn().mockImplementation(({children}) => <div className={'ToolkitProvider'}>{children}</div>)
    };
    return ToolkitProvider;
});
jest.mock('react-bootstrap-table2-paginator', () => {
    return jest.fn().mockReturnValue({});
});

describe('GenericDataYable test', () => {
    const MockedBootstrapTable = mocked(BootstrapTable, true);
    const MockedToolkitProvider = mocked(ToolkitProvider, true);
    const MockedPaginationFactory = mocked(paginationFactory, true);
    const MockedSearchBar = mocked(Search.SearchBar, true);

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        mount(<GenericDataTable
            data={[]}
            columns={[]}
            onRowClick={()=>{}}
        />)
    });
    it('Content test', async () => {
        const data = ['dataTest'];
        const columns = [{
            dataField: 'columnTest',
            text: 'columnTest'
        }];
        MockedPaginationFactory.mockReturnValue({});
        mount(<GenericDataTable
            data={data}
            columns={columns}
            onRowClick={()=>{}}
        />);
        expect(MockedToolkitProvider).toHaveBeenCalledTimes(1);
        expect(MockedToolkitProvider).toHaveBeenNthCalledWith(1, {
            keyField: "keyField",
            data,
            columns,
            search: true,
            bootstrap4: true,
            children: expect.anything()
        }, {});
        expect(MockedSearchBar).toHaveBeenCalledTimes(1);
        expect(MockedBootstrapTable).toHaveBeenCalledTimes(1);
        // expect(MockedBootstrapTable).toHaveBeenNthCalledWith(1, {
        //     striped: true,
        //     hover: true,
        //     condensed: true,
        //     pagination: {},
        //     noDataIndication: 'Table is Empty',
        // }, {});
    });
});
