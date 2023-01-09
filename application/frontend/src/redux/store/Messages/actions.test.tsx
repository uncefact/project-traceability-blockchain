import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, MsgType} from "../types/MessageType";
import {addErrorMessage, addSuccessMessage, removeMessage, setMessages} from "./actions";
import {ADD_MESSAGE, REMOVE_MESSAGE, SET_MESSAGES} from "./actionTypes";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

describe("Messages actions test", () => {
   it("setMessages test", () => {
       const messages: MsgType[] = [
           {
                text: "msg text 1",
                type: MESSAGE_TYPE_SUCCESS
           },
           {
               text: "msg text 2",
               type: MESSAGE_TYPE_SUCCESS
           }
       ];
       expect(setMessages(messages)).toEqual({
           type: SET_MESSAGES,
           payload: messages
       })
   });

   it("removeMessage test", () => {
      expect(removeMessage()).toEqual({
         type: REMOVE_MESSAGE
      });
   });

   it("addSuccessMessage test", () => {
       const messageText = "message test success";
       const expectedActions = [
           {
               type: ADD_MESSAGE,
               payload: {
                   text: messageText,
                   type: MESSAGE_TYPE_SUCCESS
               }
           },
           {
               type: REMOVE_MESSAGE
           }
       ];

       const store = mockStore({});

       jest.useFakeTimers();
       // @ts-ignore
       store.dispatch(addSuccessMessage(messageText));
       jest.advanceTimersByTime(5000);

       expect(store.getActions()).toEqual(expectedActions);
   });

    it("addErrorMessage test", () => {
        const messageText = "message test error";
        const expectedActions = [
            {
                type: ADD_MESSAGE,
                payload: {
                    text: messageText,
                    type: MESSAGE_TYPE_ERROR
                }
            },
            {
                type: REMOVE_MESSAGE
            }
        ];

        const store = mockStore({});

        jest.useFakeTimers();
        // @ts-ignore
        store.dispatch(addErrorMessage(messageText));
        jest.advanceTimersByTime(5000);

        expect(store.getActions()).toEqual(expectedActions);
    });
});