import {useSelector} from "react-redux";
import {RootState} from "./redux/store";
import {useAppDispatch} from "./redux/hooks";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from '@mui/icons-material/Visibility';

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
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Tickets</Typography>
                    <Typography variant={"body1"}>
                        The tickets page is used to report issues within the hotel rooms.
                        to add a ticket, click on the <AddIcon fontSize={"inherit"}/> button at the bottom right corner.
                        Select a name and give the ticket a title, description and status.
                        Afterwards, press the "CREATE TICKET" button.
                        The tickets can be deleted by selecting the <DeleteIcon fontSize={"inherit"} color={"error"}/> or viewed individually by selecting the <VisibilityIcon fontSize={"inherit"}/> button.
                        Selecting the <VisibilityIcon fontSize={"inherit"}/> button allows you to edit the ticket and add comments.
                        The list of tickets can also be sorted and managed according to the separate sections you
                        select.
                    </Typography>
                </Stack>
            </>
        )
    },
    "/calendar": () => {
        return (
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Calendar</Typography>
                    <Typography variant={"body1"}>
                        The calendar page allows you to select a date and add a note to it.
                        To add a note, click on a specific date and then the <AddIcon fontSize={"inherit"}/> button on the bottom right corner.
                        The <EditIcon fontSize={"inherit"}/> and <DeleteIcon color={"error"} fontSize={"inherit"}/> button will also appear next to the note to allow you to edit or delete the note respectively.
                    </Typography>
                </Stack>
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
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Users</Typography>
                    <Typography variant={"body1"}>
                        This page allows you to manage the users of the application. You can add, edit, and delete users
                    </Typography>
                    <Typography variant={"h5"}>Adding a user</Typography>
                    <Typography variant={"body1"}>
                        Click the <PersonAddIcon fontSize={"inherit"}/> button at the bottom right to add a new user. You will be presented
                        with a dialog where you can enter the user's details.
                    </Typography>
                    <Typography variant={"h5"}>Editing a user</Typography>
                    <Typography variant={"body1"}>
                        Click the <EditIcon fontSize={"inherit"}/> button on the same row as the user in the table. You will be presented
                        with a
                        dialog where you can edit the user's details.
                    </Typography>
                    <Typography variant={"h5"}>Deleting a user</Typography>
                    <Typography variant={"body1"}>
                        Click the <DeleteIcon color={"error"} fontSize={"inherit"}/> button on the same row as the user in the table. You
                        will be presented with a
                        confirmation dialog to confirm the deletion. You cannot delete the user that is currently logged
                        in.
                    </Typography>
                </Stack>
            </>
        )
    },
    "/roles": () => {
        return (
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Roles</Typography>
                    <Typography variant={"body1"}>
                        This page allows you to manage the roles of the application. You can add, edit, and delete
                        roles. Roles are used to restrict access to certain pages and features of the application. The
                        roles are assigned to users.
                    </Typography>
                    <Typography variant={"h5"}>Adding a Role</Typography>
                    <Typography variant={"body1"}>
                        Click the <AddIcon fontSize={"inherit"}/> button at the bottom right to add a new role. You will be presented with a
                        dialog where you can enter the role's details and assign permissions. Please refer to the
                        documentation for more information on permissions.
                    </Typography>
                    <Typography variant={"h5"}>Editing a Role</Typography>
                    <Typography variant={"body1"}>
                        Click the <EditIcon fontSize={"inherit"}/> button on the same row as the user in the table. You will be presented
                        with a dialog similar to the add role dialog where you can edit the role's details and
                        permissions.
                    </Typography>
                    <Typography variant={"h5"}>Deleting a Role</Typography>
                    <Typography variant={"body1"}>
                        Click the <DeleteIcon color={"error"} fontSize={"inherit"}/> button on the same row as the user in the table. You
                        will be presented with a confirmation dialog to confirm the deletion. You cannot delete roles
                        that are assigned to users.
                    </Typography>
                </Stack>
            </>
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