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
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Dashboard</Typography>
                    <Typography variant={"body1"}>
                        This page provides an overview of the status of the hotel room and customer occupancy.
                    </Typography>
                    <Typography variant={"h5"}>Room display</Typography>
                    <Typography variant={"body1"}>
                        Different colors show different states of the room. The pie chart shows how many parts of the
                        room are in different states.
                    </Typography>
                    <Typography variant={"h5"}>Customer status</Typography>
                    <Typography variant={"body1"}>
                        The number of customers in different states is displayed in numerical form.
                    </Typography>
                    <Typography variant={"h5"}>Filter</Typography>
                    <Typography variant={"body1"}>
                        You can select different room states to filter rooms or enter specific room numbers to filter
                        rooms.
                    </Typography>
                </Stack>
            </>
        )
    },
    "/rooms": () => {
        return (
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Plus Button</Typography>
                    <Typography variant={"body1"}>
                        - Location: bottom right
                        - To add new room for customer, require customer ID
                    </Typography>
                    <Typography variant={"h5"}>Detail Bar</Typography>
                    <Typography variant={"body1"}>
                        Show RoomID, code, price, description and status
                    </Typography>
                    <Typography variant={"h5"}>Pencil & Bin button</Typography>
                    <Typography variant={"body1"}>
                        - To edit customer room, modify or change capacity and price
                        - To delete or remove room.
                    </Typography>
                </Stack>
            </>
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
                        The tickets can be deleted by selecting the <DeleteIcon fontSize={"inherit"} color={"error"}/> or viewed individually
                        by selecting the <VisibilityIcon fontSize={"inherit"}/> button.
                        Selecting the <VisibilityIcon fontSize={"inherit"}/> button allows you to edit the ticket and
                        add comments.
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
                        To add a note, click on a specific date and then the <AddIcon fontSize={"inherit"}/> button on
                        the bottom right corner.
                        The <EditIcon fontSize={"inherit"}/> and <DeleteIcon color={"error"} fontSize={"inherit"}/> button will also
                        appear next to the note to allow you to edit or delete the note respectively.
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
            //"Guest-Services Page"
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Plus Button</Typography>
                    <Typography variant={"body1"}>
                        - Location: bottom right
                        - To add new guest service ex: in-room dinning, spa, massage, etc.
                        - Require ID, type of service and description
                    </Typography>
                    <Typography variant={"h5"}>Detail Bar</Typography>
                    <Typography variant={"body1"}>
                        Show OrderID, ReservationID, serviceID, Time, status, price, quantity and description.
                    </Typography>
                    <Typography variant={"h5"}>Pencil & Bin button</Typography>
                    <Typography variant={"body1"}>
                        - To delete or remove service.
                    </Typography>
                </Stack>
            </>
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
                        Click the <PersonAddIcon fontSize={"inherit"}/> button at the bottom right to add a new user.
                        You will be presented
                        with a dialog where you can enter the user's details.
                    </Typography>
                    <Typography variant={"h5"}>Editing a user</Typography>
                    <Typography variant={"body1"}>
                        Click the <EditIcon fontSize={"inherit"}/> button on the same row as the user in the table. You
                        will be presented
                        with a
                        dialog where you can edit the user's details.
                    </Typography>
                    <Typography variant={"h5"}>Deleting a user</Typography>
                    <Typography variant={"body1"}>
                        Click the <DeleteIcon color={"error"} fontSize={"inherit"}/> button on the same row as the user
                        in the table. You
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
                        Click the <AddIcon fontSize={"inherit"}/> button at the bottom right to add a new role. You will
                        be presented with a
                        dialog where you can enter the role's details and assign permissions. Please refer to the
                        documentation for more information on permissions.
                    </Typography>
                    <Typography variant={"h5"}>Editing a Role</Typography>
                    <Typography variant={"body1"}>
                        Click the <EditIcon fontSize={"inherit"}/> button on the same row as the user in the table. You
                        will be presented
                        with a dialog similar to the add role dialog where you can edit the role's details and
                        permissions.
                    </Typography>
                    <Typography variant={"h5"}>Deleting a Role</Typography>
                    <Typography variant={"body1"}>
                        Click the <DeleteIcon color={"error"} fontSize={"inherit"}/> button on the same row as the user
                        in the table. You
                        will be presented with a confirmation dialog to confirm the deletion. You cannot delete roles
                        that are assigned to users.
                    </Typography>
                </Stack>
            </>
        )
    },
    "/logs": () => {
        return (
            <>
                <Stack direction={"column"} gap={2}>
                    <Typography variant={"h4"}>Logs</Typography>
                    <Typography variant={"body1"}>
                        This page allows system administrators to track all user actions.
                    </Typography>
                    <Typography variant={"h5"}>Sort</Typography>
                    <Typography variant={"body1"}>
                        It can be sorted in ascending or descending order by number or letter.
                    </Typography>
                    <Typography variant={"h5"}>Filter</Typography>
                    <Typography variant={"body1"}>
                        You can filter and search by category or enter specific characters.
                    </Typography>
                </Stack>
            </>
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