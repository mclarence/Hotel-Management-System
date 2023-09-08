import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import appStateSlice from "../../redux/slices/appStateSlice";

export const Tickets = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Tickets'));
    }, []);
    
    return (
        <>
            This is the Tickets page
        </>
    )
}