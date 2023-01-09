import React from 'react';
import styles from './LoadingPage.module.scss'
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as loadingData from "./loading.json";
//https://lottiefiles.com/890-loading-animation
import {RootState} from "../../../../redux/store";
import {selectLoading} from "../../../../redux/store/stateSelectors";
import {connect, ConnectedProps} from "react-redux";

const mapState = (state: RootState) => (
    {
        loading: selectLoading(state)
    }
);

const connector = connect(mapState, {})

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
    //My props
}
const defaultOptions = {
    loop: true,
    autoplay: true,
    // @ts-ignore
    animationData: loadingData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}

export function LoadingPage(props: Props) {
    if(!props.loading?.show)
        return null;
    return (
        <div className={styles.LoadingPage}>
                <FadeIn>
                    <div className={styles.LoadingContent}>
                        <h1>{props.loading.text}</h1>
                        <Lottie options={defaultOptions} height={100} width={300}/>
                    </div>
                </FadeIn>

        </div>
    )
}
export default connector(LoadingPage);