import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  TextField,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DialogHeader } from "../../../../util/DialogHeader";
import EditIcon from "@mui/icons-material/Edit";
import { updateRoom } from "../../../api/rooms";
import { Room, ApiResponse } from "@hotel-management-system/models";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { stat } from "fs";

interface EditRoomDialogProps {
  room: Room | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshRooms: () => void;
}

const EditRoomDialog = (props: EditRoomDialogProps) => {
  const [roomCode, setRoomCode] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const dispatch = useAppDispatch();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChangedSomething, setHasChangedSomething] = useState(false);

  const resetState = () => {
    //reset all fields
    setRoomCode("");
    setPricePerNight(0);
    setDescription("");
    setStatus("");
  };

  useEffect(() => {
    setRoomCode(props.room?.roomCode || "");
    setPricePerNight(props.room?.pricePerNight || 0);
    setDescription(props.room?.description || "");
    setStatus(props.room?.status || "");
      }, [props.room?.roomCode, props.open]);

  useEffect(() => {
    if (
      roomCode !== props.room?.roomCode ||
      pricePerNight !== props.room?.pricePerNight ||
      description !== props.room?.description ||
      status !== props.room?.status
    ) {
      setSaveButtonDisabled(false);
      setHasChangedSomething(true);
    } else {
      setSaveButtonDisabled(true);
      setHasChangedSomething(false);
    }
  }, [roomCode, pricePerNight, description, status]);

  const handleEditRoom = () => {
    const newRoom: Room = {
      roomId: props.room?.roomId || 0,
      roomCode: roomCode,
      pricePerNight: pricePerNight,
      description: description,
      status: status,
    };

    updateRoom(newRoom)
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
              message: "Room updated successfully",
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

  const handleClose = () => {
    // ask user if they want to discard changes
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

  return (
    <Dialog open={props.open} fullWidth>
      <DialogHeader title={"Add Room"} onClose={handleClose} />
      <DialogContent>
        <Stack gap={2}>
          <Typography variant={"body1"}>Update room details below.</Typography>
          <Typography variant={"subtitle2"}>Room Details</Typography>
          <TextField
            fullWidth
            required
            label="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
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
            startIcon={<EditIcon />}
            disabled={saveButtonDisabled || isSubmitting}
            onClick={handleEditRoom}
          >
            {isSubmitting ? "Updating Room..." : "Update Room"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomDialog;
