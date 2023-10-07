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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { addGuest } from "../../../api/guests";
import {Guest, ApiResponse} from "@hotel-management-system/models"
import appStateSlice from "../../../redux/slices/AppStateSlice";
import { useAppDispatch } from "../../../redux/hooks";

interface AddGuestDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshGuests: () => void;
}

const AddGuestDialog = (props: AddGuestDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const dispatch = useAppDispatch();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    //reset all fields
    setFirstName("");
    setLastName("");
    setEmailAddress("");
    setPhoneNumber("");
    setAddress("");
  }

  useEffect(() => {
    if (
        firstName === "" ||
        lastName === ""
        ) {
        setSaveButtonDisabled(true);
        } else {
        setSaveButtonDisabled(false);
        }
  }, [firstName, lastName]);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleAddGuest = () => {
    const newGuest: Guest = {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        phoneNumber: phoneNumber,
        address: address,
        };


    addGuest(newGuest)
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Guest>) => {
        if (data.success) {
          props.setOpen(false);
          resetState();
          props.refreshGuests();
          dispatch(
            appStateSlice.actions.setSnackBarAlert({
              show: true,
              message: "Guest added successfully",
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

  return (
    <Dialog open={props.open} fullWidth>
      <DialogHeader title={"Add Guest"} onClose={handleClose} />
      <DialogContent>
        <Stack gap={2}>
          <Typography variant={"body1"}>
            Enter guest details below. The first and last name fields are
            required.
          </Typography>
          <Typography variant={"subtitle2"}>User Details</Typography>
          <Stack direction={"row"} gap={"inherit"}>
            <TextField
              fullWidth
              required
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              required
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>
          <TextField
            fullWidth
            label="Email Address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<PersonAddIcon />}
            disabled={saveButtonDisabled || isSubmitting}
            onClick={handleAddGuest}
          >
            {isSubmitting ? "Adding guest..." : "Add Guest"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;