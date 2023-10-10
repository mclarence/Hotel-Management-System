import { ApiResponse, Guest } from "@hotel-management-system/models";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { DialogHeader } from "../../../../util/components/DialogHeader";
import { addGuest } from "../../../api/guests";
import { useAppDispatch } from "../../../redux/hooks";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {handleApiResponse} from "../../../api/handleApiResponse";

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
    setIsSubmitting(true);
    const newGuest: Guest = {
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        phoneNumber: phoneNumber,
        address: address,
        };

    handleApiResponse<Guest>(
        addGuest(newGuest),
        dispatch,
        (data) => {
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
        }
    )
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
