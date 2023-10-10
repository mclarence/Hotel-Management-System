import {DialogHeader} from "../../../../util/components/DialogHeader";
import {Button, Dialog, DialogContent, Stack, Typography} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import React, {useEffect, useState} from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import LoginIcon from "@mui/icons-material/Login";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {ApiResponse, Reservation} from "@hotel-management-system/models";
import {updateReservation} from "../../../api/reservations";
import {ReservationStatuses} from "../../../../../../../libs/models/src/lib/enums/ReservationStatuses";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {Logout} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {handleApiResponse} from "../../../api/handleApiResponse";


export const CheckInDialog = (props: {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservation: Reservation;
    fetchGuestReservations: () => void;
}) => {
    const currentDateTime = new Date();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs.utc())
    const dispatch = useAppDispatch();
    const appState = useSelector((state: RootState) => state.appState);

    const handleClose = () => {
        props.setOpen(false);
    }

    useEffect(() => {
        if (selectedDateTime !== null) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }, [selectedDateTime]);

    const handleUpdateReservation = (checkIn: boolean) => {
        const tempReservationObj = {...props.reservation};

        if (selectedDateTime === null) {
            return;
        }

        const parsedTime = selectedDateTime.toDate()

        if (checkIn) {
            tempReservationObj.checkInDate = parsedTime
            tempReservationObj.reservationStatus = ReservationStatuses.CHECKED_IN;
        } else {
            tempReservationObj.checkOutDate = parsedTime
            tempReservationObj.reservationStatus = ReservationStatuses.CHECKED_OUT;
        }

        console.log(tempReservationObj)

        handleApiResponse<Reservation>(
            updateReservation(tempReservationObj),
            dispatch,
            (data) => {
                props.setOpen(false);
                props.fetchGuestReservations();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: checkIn ? "Checked in successfully" : "Checked out successfully",
                        severity: "success",
                    })
                );
            }
        )

    }

    return (
        <Dialog open={props.open} fullWidth>
            <DialogHeader title={"Check In"} onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant={"body1"}>
                        Enter check in/out date and time.
                    </Typography>
                    <DateTimePicker
                        label="Check In/Out Date and Time"
                        format={"DD/MM/YYYY hh:mm A"}
                        value={selectedDateTime}
                        onChange={setSelectedDateTime}
                        // this should not be hardcoded
                        timezone={appState.timeZone}
                    />
                    <Stack direction={"row"} gap={2}>
                        <Button
                            fullWidth
                            variant={"contained"}
                            color={"success"}
                            startIcon={<LoginIcon/>}
                            disabled={saveButtonDisabled || isSubmitting || props.reservation?.checkInDate !== null}
                            onClick={() => handleUpdateReservation(true)}
                        >
                            {isSubmitting ? "Checking in..." : "Check In"}
                        </Button>
                        <Button
                            fullWidth
                            variant={"contained"}
                            color={"error"}
                            startIcon={<LogoutIcon/>}
                            onClick={() => handleUpdateReservation(false)}
                            disabled={props.reservation?.checkInDate === null || saveButtonDisabled || isSubmitting}
                        >
                            {isSubmitting ? "Checking out..." : "Check Out"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>

    )
}