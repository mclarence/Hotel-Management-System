import {PayloadAction, createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "../../api/auth";
import {ApiResponse, User} from "@hotel-management-system/models";
import UnauthorisedError from "../../../../errors/UnauthorisedError";
import UnknownError from "../../../../errors/UnknownError";
import { Logs } from "@hotel-management-system/models";
import { getLogs } from "../../api/logs"; 

interface AppStateSlice {
    appBarTitle: string;
    snackBarAlert: {
        show: boolean;
        message: string;
        severity: 'success' | 'info' | 'warning' | 'error';
    },
    currentlyLoggedInUser?: User;
    loggedIn: boolean;
    lastPageVisited: string;
    isFetchingUserList: boolean;
    logs: Logs[];
    isFetchingLogs: boolean;
    timeZone: string;
}

const initialState: AppStateSlice = {
    appBarTitle: 'Hotel Management System',
    snackBarAlert: {
        show: false,
        message: '',
        severity: 'success'
    },
    loggedIn: false,
    lastPageVisited: '',
    isFetchingUserList: false,
    logs: [],
    isFetchingLogs: false,
    timeZone: 'Australia/Sydney'
};

export const fetchUserDetails = createAsyncThunk(
    'appState/fetchUserDetails',
    async (_, {rejectWithValue}) => {
        try {
            const response = await getCurrentUser();
            if (response.status === 401) {
                return rejectWithValue(new UnauthorisedError('You need to be logged in to access this page.'));
            } else {
                const responseData: ApiResponse<User> = await response.json();
                return responseData.data;
            }
        } catch (error) {
            return rejectWithValue(new UnknownError('An unknown error occurred. Please try again later.', error));
        }
    }
)

const appStateSlice = createSlice({
    name: 'appState',
    initialState,
    reducers: {
        setAppBarTitle: (state, action: PayloadAction<string>) => {
            state.appBarTitle = action.payload;
        },
        setSnackBarAlert: (state, action: PayloadAction<{
            show: boolean,
            message: string,
            severity: 'success' | 'info' | 'warning' | 'error'
        }>) => {
            state.snackBarAlert = action.payload;
        },
        setLoggedInUser: (state, action: PayloadAction<User>) => {
            state.loggedIn = true;
            state.currentlyLoggedInUser = action.payload;
        },
        setLastPageVisited: (state, action: PayloadAction<string>) => {
            state.lastPageVisited = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
            state.currentlyLoggedInUser = action.payload;
            state.loggedIn = true;
        })
        builder.addCase(fetchUserDetails.rejected, (state, action) => {
            if (action.payload instanceof UnauthorisedError) {
                state.loggedIn = false;
                state.snackBarAlert = {
                    show: true,
                    message: action.payload.message,
                    severity: 'warning'
                }
            } else {
                state.snackBarAlert = {
                    show: true,
                    message: "An unknown error occurred. Please try again later.",
                    severity: 'error'
                }
            }
        })
        builder.addCase(fetchLogs.fulfilled, (state, action) => {
            state.logs = action.payload;
        });
        builder.addCase(fetchLogs.rejected, (state, action) => {
            state.snackBarAlert = {
                show: true,
                message: action.error.message || 'An unknown error occurred. Please try again later.',
                severity: 'error'
            };
        });      
    }
});

export const fetchLogs = createAsyncThunk(
    'appState/fetchLogs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getLogs();
            if (response.status !== 200) {
                return rejectWithValue(new Error('Failed to fetch logs.'));
            } else {
                const responseData: ApiResponse<Logs[]> = await response.json();
                return responseData.data;
            }
        } catch (error) {
            return rejectWithValue(new Error('An unknown error occurred. Please try again later.'));
        }
    }
);

export default appStateSlice;