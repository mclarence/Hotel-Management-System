import {DialogHeader} from "../../../../util/DialogHeader";
import {Button, Dialog, DialogContent, Stack, Typography} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import React, {useEffect, useState} from "react";
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
import {Logout} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";


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

    const handleUpdateReservation = (checkIn: boolean) => {
        const tempReservationObj = {...props.reservation};

        if (checkIn) {
            tempReservationObj.checkInDate = selectedDateTime as Date;
            tempReservationObj.reservationStatus = ReservationStatuses.CHECKED_IN;
        } else {
            tempReservationObj.checkOutDate = selectedDateTime as Date;
            tempReservationObj.reservationStatus = ReservationStatuses.CHECKED_OUT;
        }

        updateReservation(tempReservationObj)
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
                            message: checkIn ? "Checked in successfully" : "Checked out successfully",
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
                            value={dayjs(selectedDateTime)}
                            // this should not be hardcoded
                            timezone={"Australia/Sydney"}
                        />
                        <Stack direction={"row"} gap={2} >
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