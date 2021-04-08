import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import * as serviceWorker from './serviceWorker';
import 'jquery/src/jquery';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';

import App from './App';
//store
import { createStore, applyMiddleware } from "redux";
import appReducers from "./reducers/index";
import { Provider } from "react-redux";
import thunk from "redux-thunk";


//test
import { persistStore, persistReducer } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';


// import { composeWithDevTools } from 'redux-devtools-extension';

// const store = createStore(appReducers, applyMiddleware(thunk));
const persistConfig = {
    key: 'data',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    transforms: [
        encryptTransform({
            secretKey: '@$^$(HJ#%)&)',
            onError: function (error) {
                // Handle the error.
                console.error('Hash Encrypt Failure');
            },
        }),
    ],
    whitelist: ['cardsReducer', 'gameReducer', 'loginReducer', 'postReducer', 'sliderReducer']
}

const persistedReducer = persistReducer(persistConfig, appReducers)

// let store = createStore(persistedReducer, composeWithDevTools(
//     applyMiddleware(thunk)
// ));
let store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);

// console.log(store.getState());
ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <App />
        </PersistGate>
    </Provider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
