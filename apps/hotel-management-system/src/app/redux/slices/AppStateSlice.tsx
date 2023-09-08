import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AppStateSlice {
    appBarTitle: string;
}

const initialState: AppStateSlice = {
    appBarTitle: 'Hotel Management System',
};

const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        setAppBarTitle: (state, action: PayloadAction<string>) => {
            state.appBarTitle = action.payload;
        }
    }
});

export default appStateSlice;