import {Button, Dialog, DialogContent, Stack, Typography,} from "@mui/material";
import {DialogHeader} from "../../../../util/DialogHeader";
import {useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import {RoomAutoCompleteBox} from "../../../../util/RoomAutoCompleteBox";
import {ApiResponse, Guest, Reservation, Room} from "@hotel-management-system/models";
import {GuestAutoCompleteBox} from "../../../../util/GuestAutoCompleteBox";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {createReservation} from "../../../api/reservations";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {ReservationStatuses} from "../../../../../../../libs/models/src/lib/enums/ReservationStatuses";

export const CreateReservationDialog = (props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchReservations: () => void;
}) => {
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guest, setGuest] = useState<Guest | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState<number | null>(null); // State variable to hold the number of nights
  const [hasChangedSomething, setHasChangedSomething] = useState(false);

  const dispatch = useAppDispatch();
  
  const handleClose = () => {
    // ask Room if they want to discard changes
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
        startDate: startDate,
        endDate: endDate,
        reservationStatus: ReservationStatuses.PENDING,
    };

    setIsSubmitting(true);

    createReservation(newReservation)
    .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Reservation>) => {
        if (data.success) {
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
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDifference = end.getTime() - start.getTime();
      const nights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Calculate the number of nights
      setNumberOfNights(nights); // Update the state variable with the result
    } else {
      setNumberOfNights(null); // Reset the number of nights if either date is not selected
    }
  }, [startDate, endDate]);

  return (
      <Dialog open={props.open} fullWidth>
        <DialogHeader title={"Create Reservation"} onClose={handleClose} />
        <DialogContent>
          <Stack gap={2}>
            <Typography variant={"body1"}>
              Enter reservation details below.
            </Typography>
            <Typography variant={"subtitle2"}>Reservation Details</Typography>
            <GuestAutoCompleteBox value={setGuest} />
            <RoomAutoCompleteBox value={setRoom} />
            <DatePicker
              label="Start Date"
              value={startDate}
              format={"DD/MM/YYYY"}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
            />
            <DatePicker
              label="End Date"
              format={"DD/MM/YYYY"}
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
            <Typography variant={"body1"}>
                Nights: {numberOfNights === null ? "..." : numberOfNights}
                <br/>
                Price: ${room === null ? "..." : numberOfNights === null ? "..." : room.pricePerNight * numberOfNights}
            </Typography>
            <Button
              variant={"contained"}
              color={"primary"}
              startIcon={<AddIcon />}
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
