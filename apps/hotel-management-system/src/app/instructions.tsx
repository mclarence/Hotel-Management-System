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
            "Calendar Page"
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