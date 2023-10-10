import {Button, Dialog, DialogContent, Stack, TextField, Typography,} from "@mui/material";
import React, {useEffect, useState} from "react";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import EditIcon from "@mui/icons-material/Edit";
import {updateRoom} from "../../../api/rooms";
import {ApiResponse, Room, RoomStatuses} from "@hotel-management-system/models";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {StatusAutoCompleteComboBox} from "./StatusAutoCompleteComboBox";
import {handleApiResponse} from "../../../api/handleApiResponse";

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
    const [status, setStatus] = useState<RoomStatuses>(RoomStatuses.AVAILABLE);

    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChangedSomething, setHasChangedSomething] = useState(false);

    const resetState = () => {
        //reset all fields
        setRoomCode("");
        setPricePerNight(0);
        setDescription("");
        setStatus(RoomStatuses.AVAILABLE);
    };

    useEffect(() => {
        setRoomCode(props.room?.roomCode || "");
        setPricePerNight(props.room?.pricePerNight || 0);
        setDescription(props.room?.description || "");
        setStatus(props.room?.status || RoomStatuses.AVAILABLE);
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
        setIsSubmitting(true);
        const newRoom: Room = {
            roomId: props.room?.roomId || 0,
            roomCode: roomCode,
            pricePerNight: pricePerNight,
            description: description,
            status: status,
        };

        handleApiResponse<Room>(
            updateRoom(newRoom),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshRooms();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "RoomCard updated successfully",
                        severity: "success",
                    })
                );
            }
        )
    }

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
            <DialogHeader title={"Add RoomCard"} onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography variant={"body1"}>Update room details below.</Typography>
                    <Typography variant={"subtitle2"}>RoomCard Details</Typography>
                    <TextField
                        fullWidth
                        required
                        label="RoomCard Code"
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
                    <StatusAutoCompleteComboBox currentValue={status} setValue={setStatus}/>
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<EditIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleEditRoom}
                    >
                        {isSubmitting ? "Updating RoomCard..." : "Update RoomCard"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default EditRoomDialog;
