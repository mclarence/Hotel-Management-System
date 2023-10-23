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
            <>
                <h5>
                    Tickets Page
                </h5>
                The tickets page is used to report issues within the hotel rooms.
                to add a ticket, click on the bottom right corner.
                Select a name and give the ticket a title, description and status. 
                Afterwards, press the "CREATE TICKET" button. 
                The tickets can be deleted by selecting the red bin icon or viewed individually by selecting the eye icon.
                Selecting the eye icon allows you to edit the ticket and add comments.
                The list of tickets can also be sorted and managed according to the seperate sections you select.
            </>
        )
    },
    "/calendar": () => {
        return (
            <>
                <h5>
                    Calendar Page
                </h5>
                The calendar page allows you to select a date and add a note to it. 
                To add a note, click on a specific date and then the plus button on the bottom right corner. 
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