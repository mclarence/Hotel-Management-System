import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import {Paper, SpeedDial} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {Ticket} from "@hotel-management-system/models";
import AddIcon from "@mui/icons-material/Add";
import {deleteTicket, getAllTickets} from "../../api/resources/tickets";
import {CreateTicketDialog} from "./components/CreateTicketDialog";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {TicketDetailsDialog} from "./components/TicketDetailsDialog";
import {useAppDispatch} from "../../redux/hooks";
import {makeApiRequest} from "../../api/makeApiRequest";
import {dateValueFormatter} from "../../../util/dateValueFormatter";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {RowDeleteButton} from "../../../util/components/RowDeleteButton";
import appStateSlice from "../../redux/slices/AppStateSlice";

export const TicketsPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCreateTicketDialog, setOpenCreateTicketDialog] = useState(false);
    const [openViewTicketDialog, setOpenViewTicketDialog] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const dispatch = useAppDispatch();
    const appState = useSelector((state: RootState) => state.appState);
    const handleViewTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setOpenViewTicketDialog(true);
    }

    const handleDeleteTicket = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) {
            return;
        }

        makeApiRequest<null>(
            deleteTicket(id),
            dispatch,
            () => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: "Ticket deleted successfully",
                    severity: 'success'
                }))
                fetchTickets();
            }
        )
    }

    const columns = useRef([
        {field: 'ticketId', headerName: 'ID', width: 100, flex: 1},
        {
            field: 'userId', headerName: 'User', width: 150, flex: 1, renderCell: (params: any) => {
                return params.row.userFirstName + " " + params.row.userLastName;
            }
        },
        {field: 'title', headerName: 'Title', width: 150, flex: 1},
        {field: 'description', headerName: 'Description', width: 150, flex: 1},
        {field: 'status', headerName: 'Status', width: 150, flex: 1},
        {field: 'dateOpened', headerName: 'Date Opened', width: 150, valueFormatter: dateValueFormatter(appState.timeZone), flex: 1},
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
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
                    <RowDeleteButton params={params} deleteFunction={handleDeleteTicket} idField={"ticketId"}/>
                </>
            )
        },
    ] as GridColDef[])

    const fetchTickets = () => {
        setIsLoading(true)
        makeApiRequest<Ticket[]>(
            getAllTickets(),
            dispatch,
            (data) => {
                setTickets(data);
                setIsLoading(false)
            }
        )
    }

    useEffect(() => {
        fetchTickets();
    }, [])
    return (
        <>
            <CreateTicketDialog open={openCreateTicketDialog} setOpen={setOpenCreateTicketDialog}
                                fetchTickets={fetchTickets}/>
            <TicketDetailsDialog open={openViewTicketDialog} setOpen={setOpenViewTicketDialog} ticket={selectedTicket}
                                 fetchTickets={fetchTickets}/>
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