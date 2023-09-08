import { Button } from "@mui/material"
import { useAppDispatch } from "../../redux/hooks";
import { useEffect } from "react";
import appStateSlice from "../../redux/slices/appStateSlice";

export const Dashboard = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Dashboard'));
    }, []);
    
    return (
        <div>
            <Button variant="outlined">Outlined</Button>
        </div>
    )
}