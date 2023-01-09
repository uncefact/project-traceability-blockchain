import {RootState} from "../../../redux/store";
import {selectMessages} from "../../../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";
import {Message} from "../Message/Message";
import React from "react";
import styles from "./MessagesBar.module.scss";


const mapState = (state: RootState) => (
    {
        messages: selectMessages(state)
    }
);

const mapDispatch = {
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    //HomePage props
};

export const MessagesBar = (props: Props) => {
    const messageList = (props.messages || []).map(message => <Message message={message}/>);

    return (
        <div className={styles.MessagesContainer}>
            {
                messageList
            }
        </div>
    )
};

export default connector(MessagesBar);