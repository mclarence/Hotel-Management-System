import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appStateSlice from "./slices/AppStateSlice";

const rootReducer = combineReducers({
    appState: appStateSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch