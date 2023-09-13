import React, { useEffect } from 'react';
import { useAppDispatch } from "../../redux/hooks";
import appStateSlice from "../../redux/slices/appStateSlice";
import HotelDashboard from './HotelDashboard'; 


export const Dashboard = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Dashboard'));
    }, []);

    return (
        <React.StrictMode>
            <HotelDashboard />
        </React.StrictMode>
    );
}
