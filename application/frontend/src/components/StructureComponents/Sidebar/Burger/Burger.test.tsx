import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import {Burger} from "./Burger";
Enzyme.configure({ adapter: new Adapter() });

describe('Sidebar test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        const func = jest.fn();
        const component = mount(
            <Burger open={true} setOpen={func}/>
        )
        component.find('Burger').simulate('click');
        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenNthCalledWith(1, false);
    });
});
