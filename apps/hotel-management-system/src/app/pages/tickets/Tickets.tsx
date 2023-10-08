import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import appStateSlice from "../../redux/slices/AppStateSlice";
import { Button, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import {verifyLogin} from "../../api/auth";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from "react";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Ticket #', width: 70 },
    { field: 'description', headerName: 'description', width: 130 },
    { field: 'room', headerName: 'Room', width: 130 },
    { field: 'guest', headerName: 'Guest', width: 130 },
    { field: 'assignedTo', headerName: 'Assigned To', width: 130 },
    { field: 'status', headerName: 'Status', width: 130},
    // add a column for a button to open the ticket

    { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params: any) => (
        <strong>
            <Button variant="outlined">
                More Details
            </Button>
        </strong>
    )},
];

const rows = [
    { id: 1, description: 'Broken TV', room: 'Jon', guest: 'Snow', assignedTo: 'Jon', status: 'Open' },
    { id: 2, description: 'Leaking Sink', room: 'Jon', guest: 'White', assignedTo: 'Mark', status: 'Open' },

];

const handleNewTicketButton = () => {

}

const handleCloseTicketButton = () => {
    const text = alert('Are you sure?');
}

export const Tickets = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const appState = useSelector((state: RootState) => state.appState);

    useEffect(() => {
        if (!appState.loggedIn) {
            navigate('/login')
        }
    }, [appState.loggedIn]);

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Tickets'));
        dispatch(appStateSlice.actions.setLastPageVisited('/tickets'));
    }, []);

    return (
        <>
            <Stack direction={'column'} gap={2}>
                <Stack direction={'row'} gap={2}>
                    <Button variant="contained" color="success" onClick = {handleNewTicketButton}>
                        New Ticket
                    </Button>
                    <Button variant="contained" color="error" onClick = {handleCloseTicketButton}>
                        Close Ticket
                    </Button>
                </Stack>
                <DataGrid
                    disableRowSelectionOnClick={true}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />

            </Stack>
        </>
    )
}