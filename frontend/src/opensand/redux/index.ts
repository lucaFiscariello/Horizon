import {configureStore} from '@reduxjs/toolkit';
import {useDispatch as useReduxDispatch, useSelector as useReduxSelector} from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';

import actionReducer from './action.ts';
import errorReducer from './error.ts';
import formReducer from './form.ts';
import modelReducer from './model.ts';
import pingReducer from './ping.ts';
import projectReducer from './projects.ts';
import sshReducer from './ssh.ts';
import tabReducer from './tab.ts';


const store = configureStore({
    reducer: {
        action: actionReducer,
        error: errorReducer,
        form: formReducer,
        model: modelReducer,
        ping: pingReducer,
        project: projectReducer,
        ssh: sshReducer,
        tab: tabReducer,
    },
    devTools: process.env.NODE_ENV === "development",
});


declare type Store = ReturnType<typeof store.getState>;
declare type Dispatch = typeof store.dispatch;
export interface ThunkConfig {
    state: Store;
    dispatch: Dispatch;
}


export const useDispatch = () => useReduxDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<Store> = useReduxSelector;


export default store;
