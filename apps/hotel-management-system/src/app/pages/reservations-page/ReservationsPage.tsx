import {Paper, SpeedDial} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import React, {useEffect, useRef, useState} from "react";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import {Guest, Reservation} from "@hotel-management-system/models";
import AddIcon from '@mui/icons-material/Add';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {getReservations} from "../../api/resources/reservations";
import {CreateReservationDialog} from "./components/CreateReservationDialog";
import {dateValueFormatter} from "../../../util/dateValueFormatter";
import {makeApiRequest} from "../../api/makeApiRequest";

const ReservationsPage = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<Reservation[]>([]);
    const [openCreateReservationDialog, setOpenCreateReservationDialog] = useState<boolean>(false);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const columns = useRef(
        [
            {field: 'reservationId', headerName: 'Reservation ID'},
            {field: 'roomCode', headerName: 'Room'},
            {
                field: 'guestName', headerName: 'Guest', renderCell: (params: any) => {
                    return params.row.guestFirstName + " " + params.row.guestLastName;
                }
            },
            {field: 'checkInDate', headerName: 'Check In Date', valueFormatter: dateValueFormatter(appState.timeZone)},
            {field: 'checkOutDate', headerName: 'Check Out Date', valueFormatter: dateValueFormatter(appState.timeZone)},
            {field: 'reservationStatus', headerName: 'Reservation Status'},
            {field: 'startDate', headerName: 'Start Date', valueFormatter: dateValueFormatter(appState.timeZone)},
            {field: 'endDate', headerName: 'End Date', valueFormatter: dateValueFormatter(appState.timeZone)},
        ] as GridColDef[]
    )

    const fetchReservations = () => {
        makeApiRequest<Reservation[]>(
            getReservations(),
            dispatch,
            (data) => {
                setRows(data);
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
