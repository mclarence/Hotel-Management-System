import {ApiResponse} from "@hotel-management-system/models";
import {ThunkDispatch} from "@reduxjs/toolkit";
import appStateSlice from "../redux/slices/AppStateSlice";
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
    if (localStorage.getItem('jwt') !== null) {
        getCurrentUser()
            .then((response) => {
                if (response.status === 401) {
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
            .then((response) => {
                console.log(response);
            })
    } else {
        navigate('/login');
        dispatch(appStateSlice.actions.setSnackBarAlert({
            show: true,
            message: 'This page requires you to be logged in.',
            severity: 'warning'
        }))
    }
}

