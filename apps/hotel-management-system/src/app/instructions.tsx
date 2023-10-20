import {useSelector} from "react-redux";
import {RootState} from "./redux/store";
import {useAppDispatch} from "./redux/hooks";

const PageInstructions: any = {
    "/rooms": () => {
        return (
            "Rooms Page"
        )
    },
    "/tickets": () => {
        return (
            "Tickets Page"
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