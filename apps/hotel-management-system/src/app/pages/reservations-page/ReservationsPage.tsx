import { Paper, SpeedDial } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { CustomNoRowsOverlay } from "../../../util/CustomNoRowsOverlay";
import {Reservation, ApiResponse} from "@hotel-management-system/models";
import AddIcon from '@mui/icons-material/Add';
import appStateSlice from "../../redux/slices/AppStateSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { getReservations } from "../../api/reservations";

const ReservationsPage = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<Reservation[]>([]);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const columns = useRef(
        [
            {field: 'reservationId', headerName: 'Reservation ID'},
            {field: 'roomId', headerName: 'Room ID'},
            {field: 'guestId', headerName: 'Guest ID'},
            {field: 'checkInDate', headerName: 'Check In Date'},
            {field: 'checkOutDate', headerName: 'Check Out Date'},
            {field: 'reservationStatus', headerName: 'Reservation Status'},
            {field: 'startDate', headerName: 'Start Date'},
            {field: 'endDate', headerName: 'End Date'},
        ]
    )

    const fetchReservations = () => {
        getReservations()
        .then((response) => {
            return response.json();
          })
          .then((data: ApiResponse<Reservation[]>) => {
            if (data.success) {
              setRows(data.data);
            } else if (!data.success && data.statusCode === 401) {
              dispatch(
                appStateSlice.actions.setSnackBarAlert({
                  show: true,
                  message: data.message,
                  severity: "warning",
                })
              );
            } else {
              dispatch(
                appStateSlice.actions.setSnackBarAlert({
                  show: true,
                  message: data.message,
                  severity: "error",
                })
              );
            }
          })
          .catch(() => {
            dispatch(
              appStateSlice.actions.setSnackBarAlert({
                show: true,
                message: "An unknown error occurred",
                severity: "error",
              })
            );
          });
    }

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Reservations'));
        dispatch(appStateSlice.actions.setLastPageVisited('/reservations'));
        fetchReservations();
    }, []);


    return (
        <>
            <Paper sx={{padding: 2}}>
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
                // onClick={() => {
                //     setOpenAddUserDialog(true)
                // }}
                icon={
                    <AddIcon/>
                }
            >
            </SpeedDial>
        </>
    )
}

export default ReservationsPage;
