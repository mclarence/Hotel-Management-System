import {useSelector} from "react-redux";
import {RootState} from "./redux/store";
import {useAppDispatch} from "./redux/hooks";
import {useEffect} from "react";
import appStateSlice from "./redux/slices/AppStateSlice";

const PageInstructions: any = {
    "/": () => {
        return (
            "Dash Board Page"
        )
    },
    "/rooms": () => {
        return (
            "Rooms Page"
        )
    },
    "/tickets": () => {
        return (
            "Tickets Page"
        )
    },
    "/calendar": () => {
        return (
            <>
                <h5>
                    Calendar Page
                </h5>
                The calendar page allows you to select a date and add a note to it. 
                To add a note, click on a specific date and then the plus button. 
                The edit and remove button will also appear next to the note.
            </>
        )
    },
    "/guests": () => {
        return (
            "Guests Page"
        )
    },
    "/guest-services": () => {
        return (
            "Guest-Services Page"
        )
    },
    "/reservations": () => {
        return (
            "Reservation Page"
        )
    },
    "/transactions": () => {
        return (
            "Transaction Page"
        )
    },
    "/check-in-out": () => {
        return (
            "Check-in-out Page"
        )
    },
    "/users": () => {
        return (
            "Users Page"
        )
    },
    "/roles": () => {
        return (
            "Roles Page"
        )
    },
    "/logs": () => {
        return (
            "Logs Page"
        )
    }
}

export const Instructions = () => {
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();


    const pageInstruction = PageInstructions[appState.lastPageVisited];

    return (
        <>
            {pageInstruction && pageInstruction()}
        </>
    )
}