import {ApiResponse} from "@hotel-management-system/models";
import {ThunkDispatch} from "@reduxjs/toolkit";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {NavigateFunction} from "react-router-dom";

export const login = (username: string, password: string): Promise<Response> => {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
}

export const getCurrentUser = (): Promise<Response> => {
    return fetch('/api/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const logout = (): Promise<Response> => {
    return fetch('/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const verifyLogin = (dispatch: ThunkDispatch<any, any, any>, navigate: NavigateFunction) => {
    // set the previous page so that we can redirect the user back to it after login
    const previousPage = window.location.pathname;

    // check if the jwt is present in local storage
    if (localStorage.getItem('jwt') !== null) {
        // the jwt token is present, so we need to verify it
        getCurrentUser()
            .then((response) => {
                if (response.status === 401) {
                    // if the token is invalid, remove it from local storage and redirect the user to the login page

                    // do not set the last page visited to the login page
                    if (previousPage !== '/login') {
                        dispatch(appStateSlice.actions.setLastPageVisited(previousPage));
                    }
                    localStorage.removeItem('jwt');
                    navigate('/login');
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: 'Your session has expired. Please log in again.',
                        severity: 'warning'
                    }))
                } else {
                    return response.json();
                }
            })
    } else {
        // the jwt token is not present, so we need to redirect the user to the login page

        // do not set the last page visited to the login page
        if (previousPage !== '/login') {
            dispatch(appStateSlice.actions.setLastPageVisited(previousPage));
        }
        navigate('/login');
        dispatch(appStateSlice.actions.setSnackBarAlert({
            show: true,
            message: 'This page requires you to be logged in.',
            severity: 'warning'
        }))
    }
}

