import {DialogHeader} from "../../../../util/DialogHeader";
import {Button, Dialog, DialogContent, Stack, Typography} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {useEffect, useState} from "react";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import LoginIcon from "@mui/icons-material/Login";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {ApiResponse, Reservation} from "@hotel-management-system/models";
import {updateReservation} from "../../../api/reservations";
import {ReservationStatuses} from "../../../../../../../libs/models/src/lib/enums/ReservationStatuses";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";

dayjs.extend(utc);
dayjs.extend(timezone);
export const CheckInDialog = (props: {
    open: boolean;
    setOpen: (open: boolean) => void;
    reservation: Reservation;
    fetchGuestReservations: () => void;
}) => {
    const currentDateTime = new Date();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(currentDateTime)
    const dispatch = useAppDispatch();
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

    const handleUpdateReservation = () => {
        updateReservation(
            {
                ...props.reservation,
                checkInDate: selectedDateTime as Date,
                reservationStatus: ReservationStatuses.CHECKED_IN
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((data: ApiResponse<Reservation>) => {
                if (data.success) {
                    props.setOpen(false);
                    props.fetchGuestReservations();
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "Check in successful",
                            severity: "success",
                        })
                    );
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
                setIsSubmitting(false);
            });
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={props.open} fullWidth>
                <DialogHeader title={"Check In"} onClose={handleClose}/>
                <DialogContent>
                    <Stack gap={2}>
                        <Typography variant={"body1"}>
                            Enter check in date and time.
                        </Typography>
                        <DateTimePicker
                            label="Check In Date and Time"
                            format={"DD/MM/YYYY hh:mm A"}
                            value={dayjs(selectedDateTime)}
                            // this should not be hardcoded
                            timezone={"Australia/Sydney"}
                        />
                        <Button
                            variant={"contained"}
                            color={"success"}
                            startIcon={<LoginIcon/>}
                            disabled={saveButtonDisabled || isSubmitting}
                            onClick={handleUpdateReservation}
                        >
                            {isSubmitting ? "Checking in..." : "Check In"}
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </LocalizationProvider>

    )
}