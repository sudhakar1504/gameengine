import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import allpagesReducer from './features/allpages/allpages';
import editorReducer from './features/editor/editor';
import interactionReducer from './features/interactions/interaction';

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userReducer,
            allpages: allpagesReducer,
            editor: editorReducer,
            interaction: interactionReducer,
        },
        devTools: process.env.NODE_ENV !== 'production',
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
