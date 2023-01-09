import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import {applyMiddleware, compose, createStore} from "redux";
import {rootReducer} from "./redux/store";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
// import {detect } from "detect-browser";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// const browser = detect();
// const supportedBrowserNames = ['edge-chromium', 'chrome'];
// const currentBrowserName = browser && browser.name || '';
// const isCurrentBrowserSupported = supportedBrowserNames.includes(currentBrowserName);
//
// if(!isCurrentBrowserSupported) {
//     window.alert('Warning!\nThis browser is not fully supported. Some features may not work.\nPlease use Google Chrome or Microsoft Edge.');
// }
ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <Router>
                    <App/>
                </Router>
            </Provider>
        </React.StrictMode> ,
        document.getElementById('root')
)



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
