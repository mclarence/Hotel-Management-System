import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { ApiResponse, Role, Room } from "@hotel-management-system/models";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import { addRoom } from "../../../api/rooms";
import { DialogHeader } from "../../../../util/DialogHeader";
import AddIcon from "@mui/icons-material/Add";

interface AddRoomDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshRooms: () => void;
}

export const AddRoomDialog = (props: AddRoomDialogProps) => {
  const [roomCode, setroomCode] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [hasChangedSomething, setHasChangedSomething] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const resetState = () => {
    //reset all fields
    setroomCode("");
    setPricePerNight(0);
    setDescription("");
    setStatus("");
  };

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

  const handleAddRoom = () => {
    setIsSubmitting(true);
    const newRoom: Room = {
      roomCode: roomCode,
      pricePerNight: pricePerNight,
      description: description,
      status: status,
    };

    // send request to add Room
    addRoom(newRoom)
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Room>) => {
        if (data.success) {
          props.setOpen(false);
          resetState();
          props.refreshRooms();
          dispatch(
            appStateSlice.actions.setSnackBarAlert({
              show: true,
              message: "Room added successfully",
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
    if (roomCode !== "" || pricePerNight !== 0 || description !== "" || status !== "") {
      setHasChangedSomething(true);
    } else {
      setHasChangedSomething(false);
    }

    if (roomCode !== "" && description !== "" && status !== "") {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [roomCode, pricePerNight, description, status]);

  return (
    <Dialog open={props.open} fullWidth>
      <DialogHeader title={"Add Room"} onClose={handleClose} />
      <DialogContent>
        <Stack gap={2}>
          <Typography variant={"body1"}>Enter Room details below.</Typography>
          <Typography variant={"subtitle2"}>Room Details</Typography>
          <TextField
            fullWidth
            required
            label="Room Code"
            value={roomCode}
            onChange={(e) => setroomCode(e.target.value)}
          />
          <TextField
            fullWidth
            required
            label="Price Per Night"
            inputProps={{
              min: 0,
              step: 0.01,
            }}
            type="number"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(parseFloat(e.target.value))}
          />
          <TextField
            fullWidth
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<AddIcon />}
            disabled={saveButtonDisabled || isSubmitting}
            onClick={handleAddRoom}
          >
            {isSubmitting ? "Adding Room..." : "Add Room"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
