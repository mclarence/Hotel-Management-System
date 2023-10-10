import {Button, Dialog, DialogContent, Stack, Typography,} from "@mui/material";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import {RoomAutoCompleteBox} from "../../../../util/components/RoomAutoCompleteBox";
import {ApiResponse, Guest, Reservation, Room} from "@hotel-management-system/models";
import {GuestAutoCompleteBox} from "../../../../util/components/GuestAutoCompleteBox";
import {DatePicker} from "@mui/x-date-pickers";
import {createReservation} from "../../../api/reservations";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {ReservationStatuses} from "../../../../../../../libs/models/src/lib/enums/ReservationStatuses";
import dayjs, {Dayjs} from "dayjs";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {handleApiResponse} from "../../../api/handleApiResponse";

export const CreateReservationDialog = (props: {
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchReservations: () => void;
}) => {
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs.utc());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs.utc());
    const [numberOfNights, setNumberOfNights] = useState<number | null>(null); // State variable to hold the number of nights
    const [hasChangedSomething, setHasChangedSomething] = useState(false);
    const appState = useSelector((state: RootState) => state.appState);

    const dispatch = useAppDispatch();

    const handleClose = () => {
        // ask RoomCard if they want to discard changes
        if (hasChangedSomething) {
            if (window.confirm("Are you sure you want to discard changes?")) {
                resetState();
                props.setOpen(false);
            }
        } else {
            resetState();
            props.setOpen(false);
        }
    };

    const resetState = () => {
        setGuest(null);
        setRoom(null);
        setStartDate(null);
        setEndDate(null);
        setNumberOfNights(null);
    }

    const handleCreateReservation = () => {
        if (guest === null || room === null || startDate === null || endDate === null) {
            return;
        }

        const newReservation: Reservation = {
            guestId: guest.guestId ?? 0,
            roomId: room.roomId ?? 0,
            startDate: startDate.utc().tz(appState.timeZone).startOf("day").toDate(), // convert to date object (not dayjs object)
            endDate: endDate.utc().tz(appState.timeZone).startOf("day").toDate(), // convert to date object (not dayjs object
            reservationStatus: ReservationStatuses.PENDING,
        };

        setIsSubmitting(true);

        handleApiResponse<Reservation>(
            createReservation(newReservation),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.fetchReservations();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Reservation created",
                        severity: "success",
                    })
                );
            }
        )

    };

    useEffect(() => {
        // set haschangedsomething to true if any of the fields have been changed
        if (guest !== null || room !== null || startDate !== null || endDate !== null) {
            setHasChangedSomething(true);
        } else {
            setHasChangedSomething(false);
        }


        if (guest !== null && room !== null && startDate !== null && endDate !== null) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }, [guest, room, startDate, endDate])

    useEffect(() => {
        // Calculate the number of nights when start and end dates change
        if (startDate && endDate) {
            const nights = endDate.diff(startDate, "day");
            setNumberOfNights(nights); // Update the state variable with the result
        } else {
            setNumberOfNights(null); // Reset the number of nights if either date is not selected
        }
    }, [startDate, endDate]);

    return (
        <Dialog open={props.open} fullWidth>
            <DialogHeader title={"Create Reservation"} onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant={"body1"}>
                        Enter reservation details below.
                    </Typography>
                    <Typography variant={"subtitle2"}>Reservation Details</Typography>
                    <GuestAutoCompleteBox value={setGuest}/>
                    <RoomAutoCompleteBox value={setRoom}/>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        format={"DD/MM/YYYY"}
                        onChange={setStartDate}
                        timezone={appState.timeZone}
                    />
                    <DatePicker
                        label="End Date"
                        format={"DD/MM/YYYY"}
                        value={endDate}
                        onChange={setEndDate}
                        timezone={appState.timeZone}
                    />
                    <Typography variant={"body1"}>
                        Nights: {numberOfNights === null ? "..." : numberOfNights}
                        <br/>
                        Price:
                        ${room === null ? "..." : numberOfNights === null ? "..." : room.pricePerNight * numberOfNights}
                    </Typography>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<AddIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleCreateReservation}
                    >
                        {isSubmitting ? "Creating reservation..." : "Create Reservation"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
