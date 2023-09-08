import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./slices/appStateSlice";

const rootReducer = combineReducers({
    appState: appStateSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch