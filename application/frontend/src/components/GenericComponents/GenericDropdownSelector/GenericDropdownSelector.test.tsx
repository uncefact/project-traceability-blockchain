import React from "react";
import {mocked} from "ts-jest/utils";
import {Button, Dropdown, Form} from "react-bootstrap";
import Enzyme, {mount} from "enzyme";
import {GenericDropdownSelector} from "./GenericDropdownSelector";
import Adapter from "enzyme-adapter-react-16";
import {act} from "react-dom/test-utils";

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-bootstrap', () => {
    let Button = jest.fn().mockImplementation(({children}) => <div className={'Button'}>{children}</div>);
    let Form = jest.fn().mockImplementation(({children}) => <div className={'Form'}>{children}</div>);
    let Spinner = jest.fn().mockImplementation(({children}) => <div className={'Spinner'}>{children}</div>);
    let Dropdown = jest.fn().mockImplementation(({children}) => <div className={'Dropdown'}>{children}</div>);

    // @ts-ignore
    Form.Control = jest.fn().mockImplementation(({children}) => <div className={'FormControl'}>{children}</div>);
    // @ts-ignore
    Dropdown.Toggle = jest.fn().mockImplementation(({children}) => <div className={'DropdownToggle'}>{children}</div>);
    // @ts-ignore
    Dropdown.Menu = jest.fn().mockImplementation(({children}) => <div className={'DropdownMenu'}>{children}</div>);
    // @ts-ignore
    Dropdown.Divider = jest.fn().mockImplementation(({children}) => <div className={'DropdownDivider'}>{children}</div>);
    // @ts-ignore
    Dropdown.Item = jest.fn().mockImplementation(({children}) => <div className={'DropdownItem'}>{children}</div>);

    return {
        Button,
        Form,
        Spinner,
        Dropdown
    };
});
jest.mock('../../app/commons/transactions/TransactionProcessesCustomMenu', () => {
    return {
        TransactionProcessesCustomMenu: jest.fn().mockImplementation(({children}) => <div className={'TransactionProcessesCustomMenu'}>{children}</div>),
    };
});
jest.useFakeTimers();
describe('GenericDropdownSelector test', () => {
    const MockedButton = mocked(Button, true);
    const MockedFormControl = mocked(Form.Control, true);
    const MockedDropdown = mocked(Dropdown, true);
    const MockedDropdownItem = mocked(Dropdown.Item, true);
    const MockedDropdownToggle = mocked(Dropdown.Toggle, true);
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it('Render without crashing', async () => {
        await act(async () => {
            await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={()=>{}}
                itemPropToShow={''}
                selectItem={()=>{}}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
    });
    it('Content test - error', async () => {
        let component;
        await act(async () => {
            component = mount(<GenericDropdownSelector
                defaultText={''}
                getItems={()=>{}}
                itemPropToShow={''}
                selectItem={()=>{}}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
    });
    it('retrieveItems test', async () => {
        const getItems = jest.fn().mockReturnValue([{
            name: 'itemNameTest'
        }]);
        await act(async () => {
            await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={()=>{}}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
        expect(MockedDropdownItem).toHaveBeenCalledTimes(5);
        expect(MockedDropdownItem).toHaveBeenNthCalledWith(4, {
            onClick: expect.any(Function),
            children: 'itemNameTest'
        }, {});
    });
    it('retrieveItems test - already selected item', async () => {
        const getItems = jest.fn().mockReturnValue([{
            name: 'itemNameTest'
        }]);
        await act(async () => {
            await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={()=>{}}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={true}
                creationTitle={''}/>);
        });
        expect(MockedDropdownItem).toHaveBeenCalledTimes(7);
        expect(MockedDropdownItem).toHaveBeenNthCalledWith(6, {
            onClick: expect.any(Function),
            children: 'itemNameTest'
        }, {});
        expect(MockedDropdownToggle).toHaveBeenCalledTimes(6);
        expect(MockedDropdownToggle).toHaveBeenNthCalledWith(6, {
            id: 'dropdown-custom-components',
            children: 'itemNameTest'
        }, {});
    });
    it('retrieveItems test - error', async () => {
        const getItems = jest.fn().mockImplementation(() => {throw 'Error'});
        await act(async () => {
            await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={()=>{}}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
        expect(MockedDropdownItem).toHaveBeenCalledTimes(1);
    });
    it('handleItemClick test', async () => {
        const item = {
            name: 'itemNameTest'
        };
        const getItems = jest.fn().mockReturnValue([item]);
        const selectItem = jest.fn();
        await act(async () => {
            await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={selectItem}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
        expect(MockedDropdownItem).toHaveBeenCalledTimes(5);
        act(() => {
            // @ts-ignore
            MockedDropdownItem.mock.calls[3][0].onClick();
        });
        expect(selectItem).toHaveBeenCalledTimes(1);
        expect(selectItem).toHaveBeenNthCalledWith(1, item);
        expect(MockedDropdownToggle).toHaveBeenCalledTimes(5);
        expect(MockedDropdownToggle).toHaveBeenNthCalledWith(5, {
            id: 'dropdown-custom-components',
            children: item.name
        }, {});
    });
    it('handleOnToggle test', async () => {
        const item = {
            name: 'itemNameTest'
        };
        const getItems = jest.fn().mockReturnValue([item]);
        const selectItem = jest.fn();
        await act(async () => {
            await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={selectItem}
                newItemFields={[]}
                onCreate={()=>Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''} />);
        });
        expect(MockedDropdown).toHaveBeenCalledTimes(4);
        expect(MockedDropdown.mock.calls[3][0].show).toBeFalsy();
        act(() => {
            // @ts-ignore
            MockedDropdown.mock.calls[3][0].onToggle(true, true);
        });
        expect(MockedDropdown).toHaveBeenCalledTimes(5);
        expect(MockedDropdown.mock.calls[4][0].show).toBeTruthy();
    });
    it('handleCancel test', async () => {
        const item = {
            name: 'itemNameTest'
        };
        const getItems = jest.fn().mockReturnValue([item]);
        const selectItem = jest.fn();
        let component : any = null;
        await act(async () => {
            component = await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={selectItem}
                newItemFields={[]}
                onCreate={() => Promise.resolve(true)}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
        expect(MockedButton).toHaveBeenCalledTimes(0);
        await act(async () => {
            await component.find('.CreateNewContainer').simulate('click');
            jest.advanceTimersByTime(2);
        });
        expect(MockedButton).toHaveBeenCalledTimes(4);
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[2][0].onClick();
            jest.advanceTimersByTime(2);
        });
        expect(MockedDropdown).toHaveBeenCalledTimes(7);
        expect(MockedDropdown.mock.calls[6][0].show).toBeTruthy();
    });
    it('addNewItemProp & handleCreate test', async () => {
        const item = {
            name: 'itemNameTest'
        };
        const getItems = jest.fn().mockReturnValue([item]);
        const selectItem = jest.fn();
        const onCreate = jest.fn().mockReturnValue(true);
        let component : any = null;
        await act(async () => {
            component = await mount(<GenericDropdownSelector
                defaultText={''}
                getItems={getItems}
                itemPropToShow={'name'}
                selectItem={selectItem}
                newItemFields={['name', 'age']}
                onCreate={onCreate}
                createDisabled={()=>false}
                required={false}
                creationTitle={''}/>);
        });
        expect(MockedButton).toHaveBeenCalledTimes(0);
        await act(async () => {
            await component.find('.CreateNewContainer').simulate('click');
            jest.advanceTimersByTime(2);
        });
        expect(MockedFormControl).toHaveBeenCalledTimes(4);
        await act(async () => {
            // @ts-ignore
            MockedFormControl.mock.calls[2][0].onChange({target: {value: 'newNameTest'}});
        });
        expect(MockedButton).toHaveBeenCalledTimes(6);
        await act(async () => {
            // @ts-ignore
            MockedButton.mock.calls[5][0].onClick();
            jest.advanceTimersByTime(2);
        });
        expect(onCreate).toHaveBeenCalledTimes(1);
        expect(onCreate).toHaveBeenNthCalledWith(1, {
            name: 'newNameTest'
        });
        expect(MockedDropdown).toHaveBeenCalledTimes(12);
        expect(MockedDropdown.mock.calls[11][0].show).toBeFalsy();
    });
});
