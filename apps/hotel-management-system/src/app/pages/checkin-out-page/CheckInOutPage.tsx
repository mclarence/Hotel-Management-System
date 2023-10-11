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
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect, useRef, useState} from "react";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../redux/hooks";
import {searchGuests} from "../../api/resources/guests";
import {
    Guest,
    ApiResponse,
    Reservation,
} from "@hotel-management-system/models";
import {GuestAutoCompleteBox} from "../../../util/components/GuestAutoCompleteBox";
import {searchReservations} from "../../api/resources/reservations";
import {CheckInDialog} from "./components/CheckInDialog";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {dateValueFormatter} from "../../../util/dateValueFormatter";
import {makeApiRequest} from "../../api/makeApiRequest";

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
    const appState = useSelector((state: RootState) => state.appState);


    const openCheckInDialog = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setCheckInDialogOpen(true);
    }

    const columns = useRef([
        {field: "reservationId", headerName: "Reservation ID", flex: 1},
        {field: "roomId", headerName: "RoomCard ID", flex: 1},
        {field: "startDate", headerName: "Start Date", flex: 1, valueFormatter: dateValueFormatter(appState.timeZone)},
        {field: "endDate", headerName: "End Date", flex: 1, valueFormatter: dateValueFormatter(appState.timeZone)},
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
                    <Button color="success" variant="contained" disabled={params.row.checkInDate !== null}
                            onClick={() => openCheckInDialog(params.row)}>
                        Check In
                    </Button>
                    <Button color="error" variant="contained"
                            disabled={params.row.checkInDate === null || params.row.checkOutDate !== null}
                            onClick={() => openCheckInDialog(params.row)}>
                        Check Out
                    </Button>
                </Stack>
            ),
        },
    ] as GridColDef[]);

    function fetchGuestReservations() {
        if (selectedGuest !== null) {
            setReservationTableLoading(true);
            // fetch the reservations for the selected guest

            makeApiRequest<Reservation[]>(
                searchReservations({
                    guestId: selectedGuest?.guestId,
                }),
                dispatch,
                (data) => {
                    setReservationRows(data);
                    setReservationTableLoading(false);
                }
            )
        }
    }

    useEffect(() => {
        fetchGuestReservations();
    }, [selectedGuest]);

    useEffect(() => {
        if (selectedGuest === null) {
            setReservationRows([]);
        }
    }, [selectedGuest]);


    return (
        <>
            <CheckInDialog fetchGuestReservations={fetchGuestReservations} open={checkInDialogOpen}
                           setOpen={setCheckInDialogOpen} reservation={selectedReservation as Reservation}/>
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
                                loading={reservationTableLoading}
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
