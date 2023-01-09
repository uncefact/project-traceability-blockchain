import Enzyme, {mount} from "enzyme";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import {GenericCard} from "./GenericCard";

Enzyme.configure({ adapter: new Adapter() });
describe('GenericCard test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('Render without crashing', async () => {
        mount(
            // TODO: capire se devo passare delle proprietà a caso oppure renderle in qualche modo finte (in junit ad esempio come any())
            <GenericCard title="test card" elements={[{name: "test item 1", value: "1"}, {name: "test item 2"}]}/>
        );
    });
    it('Content test', async () => {

        let component = mount(
            <GenericCard title="test card" elements={[{name: "test item 1", value: "1"}, {name: "test item 2"}]}/>
        );
        expect(component.find('div').length).toEqual(1);
        expect(component.find('h4').length).toEqual(1);
        expect(component.find('h4').text()).toEqual("test card");
        expect(component.find('p').length).toEqual(2);
    });
});
