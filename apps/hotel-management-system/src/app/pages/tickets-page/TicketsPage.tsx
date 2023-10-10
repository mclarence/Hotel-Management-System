import {DataGrid} from "@mui/x-data-grid";
import {CustomNoRowsOverlay} from "../../../util/CustomNoRowsOverlay";
import {Paper, SpeedDial} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {ApiResponse, Ticket} from "@hotel-management-system/models";
import AddIcon from "@mui/icons-material/Add";
import {getAllTickets} from "../../api/tickets";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {CreateTicketDialog} from "./components/CreateTicketDialog";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {TicketDetailsDialog} from "./components/TicketDetailsDialog";
import {useAppDispatch} from "../../redux/hooks";

export const TicketsPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCreateTicketDialog, setOpenCreateTicketDialog] = useState(false);
    const [openViewTicketDialog, setOpenViewTicketDialog] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const dispatch = useAppDispatch();
    const handleViewTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setOpenViewTicketDialog(true);
    }

    const columns = useRef([
        {field: 'ticketId', headerName: 'ID', width: 100},
        {field: 'userId', headerName: 'User ID', width: 150},
        {field: 'title', headerName: 'Title', width: 150},
        {field: 'description', headerName: 'Description', width: 150},
        {field: 'status', headerName: 'Status', width: 150},
        {field: 'dateOpened', headerName: 'Date Opened', width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <>
                    <IconButton size={"small"} onClick={() => handleViewTicket(params.row)}>
                        <VisibilityIcon fontSize={"inherit"}/>
                    </IconButton>
                </>
            )
        },
    ])

    const fetchTickets = () => {
        getAllTickets()
            .then((response) => response.json())
            .then((data: ApiResponse<Ticket[]>) => {

                if (data.success) {
                    setTickets(data.data)
                }

                if (data.statusCode === 401 && !data.success) {
                    console.log(data.message);
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: data.message,
                        severity: 'warning'
                    }))
                } else if (!data.success) {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: data.message,
                        severity: 'error'
                    }))
                }
            })
            .catch((error) => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: error.message,
                    severity: 'error'
                }))
            }).finally(() => {
            setIsLoading(false)
        })
    }
    useEffect(() => {
        fetchTickets();
    }, [])
    return (
        <>
            <CreateTicketDialog open={openCreateTicketDialog} setOpen={setOpenCreateTicketDialog}
                                fetchTickets={fetchTickets}/>
            <TicketDetailsDialog open={openViewTicketDialog} setOpen={setOpenViewTicketDialog} ticket={selectedTicket} fetchTickets={fetchTickets}/>
            <Paper sx={{padding: 2}}>
                <DataGrid
                    density={"compact"}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={tickets}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => {
                        return row.ticketId!;
                    }}
                    autoHeight={true}
                    sx={{height: "100%"}}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </Paper>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: 'fixed', bottom: 16, right: 16}}
                onClick={() => {
                    setOpenCreateTicketDialog(true)
                }}
                icon={
                    <AddIcon/>
                }
            >
            </SpeedDial>
        </>
    )
}