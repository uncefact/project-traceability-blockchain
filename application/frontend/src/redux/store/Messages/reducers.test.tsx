import {ADD_MESSAGE, MessagesActionTypes, REMOVE_MESSAGE, SET_MESSAGES} from "./actionTypes";
import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, MsgType} from "../types/MessageType";
import {messagesReducer} from "./reducers";

describe("Messages reducers test", () => {
   it("Set messages test", () => {
      const action: MessagesActionTypes = {
          type: SET_MESSAGES,
          payload: [
              {
                  text: "msg text 1",
                  type: MESSAGE_TYPE_SUCCESS
              },
              {
                  text: "msg text 2",
                  type: MESSAGE_TYPE_SUCCESS
              }
          ]
      };
      expect(messagesReducer(null, action)).toEqual(action.payload);
   });

   it("Add message test state not null", () => {
       const oldState : MsgType[] = [
           {
               text: "msg text 1",
               type: MESSAGE_TYPE_SUCCESS
           },
           {
               text: "msg text 2",
               type: MESSAGE_TYPE_ERROR
           }
       ];
       const action: MessagesActionTypes = {
           type: ADD_MESSAGE,
           payload: {
               text: "message test",
               type: MESSAGE_TYPE_SUCCESS
           }
       };

       expect(messagesReducer(oldState, action)).toEqual([...oldState, action.payload]);
   });

   it("Add message test state null", () => {
      const action: MessagesActionTypes = {
          type: ADD_MESSAGE,
          payload: {
              text: "message test",
              type: MESSAGE_TYPE_SUCCESS
          }
      };

      expect(messagesReducer(null, action)).toEqual([action.payload]);
   });

   it("Remove message test state not null", () => {
       const oldState : MsgType[] = [
           {
               text: "msg text 1",
               type: MESSAGE_TYPE_SUCCESS
           },
           {
               text: "msg text 2",
               type: MESSAGE_TYPE_ERROR
           }
       ];
       const action: MessagesActionTypes = {
           type: REMOVE_MESSAGE
       };

       let newState = [...oldState];
       newState.shift();
       expect(messagesReducer(oldState, action)).toEqual(newState);
   });

    it("Remove message test state null", () => {
        const action: MessagesActionTypes = {
            type: REMOVE_MESSAGE
        };

        expect(messagesReducer(null, action)).toEqual(null);
    });
});