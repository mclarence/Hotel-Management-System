import {
    Autocomplete,
    Button,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect, useRef, useState} from "react";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../redux/hooks";
import {searchGuests} from "../../api/guests";
import {
    Guest,
    ApiResponse,
    Reservation,
} from "@hotel-management-system/models";
import {GuestAutoCompleteBox} from "../../../util/GuestAutoCompleteBox";
import {searchReservations} from "../../api/reservations";
import {CheckInDialog} from "./components/CheckInDialog";

interface CheckInPageProps {
}

const CheckInOutPage = (props: CheckInPageProps) => {
    const dispatch = useAppDispatch();
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Guest[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [reservationRows, setReservationRows] = useState<Reservation[]>([]);
    const [reservationTableLoading, setReservationTableLoading] = useState(false);
    const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);


    const openCheckInDialog = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setCheckInDialogOpen(true);
    }

    const columns = useRef([
        {field: "reservationId", headerName: "Reservation ID", flex: 1},
        {field: "roomId", headerName: "Room ID", flex: 1},
        {field: "startDate", headerName: "Start Date", flex: 1},
        {field: "endDate", headerName: "End Date", flex: 1},
        {
            field: "reservationStatus",
            headerName: "Reservation Status",
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            flex: 2,
            renderCell: (params: any) => (
                <Stack direction={"row"} gap={2}>
                    <Button color="success" variant="contained" disabled={params.row.checkInDate !== null} onClick={() => openCheckInDialog(params.row)}>
                        Check In
                    </Button>
                    <Button color="error" variant="contained" disabled={params.row.checkInDate === null || params.row.checkOutDate !== null} onClick={() => openCheckInDialog(params.row)}>
                        Check Out
                    </Button>
                </Stack>
            ),
        },
    ]);

    function fetchGuestReservations() {
        if (selectedGuest !== null) {
            setReservationTableLoading(true);
            // fetch the reservations for the selected guest
            searchReservations({
                guestId: selectedGuest?.guestId,
            })
                .then((response) => {
                    return response.json();
                })
                .then((data: ApiResponse<Reservation[]>) => {
                    if (data.success) {
                        setReservationRows(data.data);
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
                })
                .finally(() => {
                    setReservationTableLoading(false);
                });
        }
    }

    useEffect(() => {
        fetchGuestReservations();
    }, [selectedGuest]);

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle("Check In/Out"));
        dispatch(appStateSlice.actions.setLastPageVisited("/check-in-out"));
    }, []);

    return (
        <>
            <CheckInDialog fetchGuestReservations={fetchGuestReservations} open={checkInDialogOpen} setOpen={setCheckInDialogOpen} reservation={selectedReservation as Reservation}/>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{padding: 2}}>
                        <Stack
                            direction={"row"}
                            gap={2}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Typography variant={"body1"} sx={{width: "150px"}}>
                                Enter Guest Name:
                            </Typography>
                            <GuestAutoCompleteBox value={setSelectedGuest}/>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper sx={{padding: 2}}>
                        <Stack direction={"column"} gap={2}>
                            <Typography variant={"h5"}>Guest Details</Typography>
                            <Divider/>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>First Name:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>
                                        {selectedGuest === null ? "..." : selectedGuest.firstName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>Last Name:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>
                                        {selectedGuest === null ? "..." : selectedGuest.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>Email:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>
                                        {selectedGuest === null ? "..." : selectedGuest.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>Phone Number:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>
                                        {selectedGuest === null ? "..." : selectedGuest.phoneNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>Address:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant={"body1"}>
                                        {selectedGuest === null ? "..." : selectedGuest.address}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Paper sx={{padding: 2}}>
                        <Stack direction={"column"} gap={2}>
                            <Typography variant={"h5"}>Reservations</Typography>
                            <Divider/>
                            {/* create a datagrid listing the guests current reservations */}
                            <DataGrid
                                autoHeight
                                checkboxSelection={false}
                                rows={reservationRows}
                                columns={columns.current}
                                getRowId={(row: any) => {
                                    return row.reservationId;
                                }}
                            />
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
        ;
};

export default CheckInOutPage;
