import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import MB, {MessagesBar} from "./MessagesBar";
import React from "react";
import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, MsgType} from "../../../redux/store/types/MessageType";
import {Message} from "../Message/Message";

Enzyme.configure({ adapter: new Adapter() });
const mockStore = configureMockStore([thunk]);
let store = mockStore({});

jest.mock('../Message/Message', () => {
    return {
        Message: jest.fn().mockImplementation(({children}) => <div className={'Message'}>{children}</div>)
    };
});

describe("MessageBar test", () => {
    const messages: MsgType[] = [
        {
            text: "msg text 1",
            type: MESSAGE_TYPE_SUCCESS
        },
        {
            text: "msg text 2",
            type: MESSAGE_TYPE_SUCCESS
        },
        {
            text: "msg text 3",
            type: MESSAGE_TYPE_ERROR
        }
    ];

   it("Render without crash",  () => {
       mount (
           <Provider store={store}>
               <MB/>
           </Provider>
       );

       mount(
           <MessagesBar messages={messages}/>
       )
   });

    it('Content test', () => {
        let component = mount(
            <MessagesBar messages={messages}/>
        );

        expect(component.find(".MessagesContainer").length).toEqual(1);
        // TODO: fixare quest'ultima parte di test e capire i warning che mi da nell'intero file
        // expect(Message).toHaveBeenCalledTimes(3);
        // expect(Message).toHaveBeenNthCalledWith(1, messages[0], {});
        // expect(Message).toHaveBeenNthCalledWith(2, messages[1], {});
        // expect(Message).toHaveBeenNthCalledWith(3, messages[2], {});
    });
});