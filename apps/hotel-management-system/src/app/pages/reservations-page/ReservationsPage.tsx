import {Paper, SpeedDial} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import React, {useEffect, useRef, useState} from "react";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import {Guest, Reservation} from "@hotel-management-system/models";
import AddIcon from '@mui/icons-material/Add';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {deleteReservation, getReservations} from "../../api/resources/reservations";
import {CreateReservationDialog} from "./components/CreateReservationDialog";
import {dateValueFormatter} from "../../../util/dateValueFormatter";
import {makeApiRequest} from "../../api/makeApiRequest";
import {RowDeleteButton} from "../../../util/components/RowDeleteButton";
import appStateSlice from "../../redux/slices/AppStateSlice";

const ReservationsPage = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<Reservation[]>([]);
    const [openCreateReservationDialog, setOpenCreateReservationDialog] = useState<boolean>(false);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const handleDeletingSingleRow = (reservationId: number) => {
        if (!window.confirm('Are you sure you want to delete this reservation?')) {
            return;
        }

        makeApiRequest<null>(
            deleteReservation(reservationId),
            dispatch,
            (data) => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: "Reservation deleted successfully",
                    severity: 'success'
                }))
                fetchReservations();
            }
        )
    }

    const columns = useRef(
        [
            {field: 'reservationId', headerName: 'ID', width: 50},
            {field: 'roomCode', headerName: 'Room', width: 100},
            {
                field: 'guestName', headerName: 'Guest', renderCell: (params: any) => {
                    return params.row.guestFirstName + " " + params.row.guestLastName;
                }
            },
            {field: 'checkInDate', headerName: 'Check In Date', valueFormatter: dateValueFormatter(appState.timeZone), width: 170},
            {field: 'checkOutDate', headerName: 'Check Out Date', valueFormatter: dateValueFormatter(appState.timeZone), width: 170},
            {field: 'reservationStatus', headerName: 'Reservation Status', width: 150},
            {field: 'startDate', headerName: 'Start Date', valueFormatter: dateValueFormatter(appState.timeZone), width: 170},
            {field: 'endDate', headerName: 'End Date', valueFormatter: dateValueFormatter(appState.timeZone), width: 170},
            {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => <RowDeleteButton params={params} deleteFunction={handleDeletingSingleRow}
                                                          idField={"reservationId"}/>,
        },
        ] as GridColDef[]
    )

    const fetchReservations = () => {
        setIsLoading(true)
        makeApiRequest<Reservation[]>(
            getReservations(),
            dispatch,
            (data) => {
                setRows(data);
                setIsLoading(false)
            }
        )
    }

    useEffect(() => {
        fetchReservations();
    }, []);


    return (
        <>
            <Paper sx={{padding: 2}}>
                <CreateReservationDialog open={openCreateReservationDialog} setOpen={setOpenCreateReservationDialog}
                                         fetchReservations={fetchReservations}/>
                <DataGrid
                    density={'compact'}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={rows}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row: any) => {
                        return row.reservationId;
                    }}
                    autoHeight={true}
                    sx={{height: '100%'}}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </Paper>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: 'fixed', bottom: 16, right: 16}}
                onClick={() => {
                    setOpenCreateReservationDialog(true)
                }}
                icon={
                    <AddIcon/>
                }
            >
            </SpeedDial>
        </>
    )
}

export default ReservationsPage;
