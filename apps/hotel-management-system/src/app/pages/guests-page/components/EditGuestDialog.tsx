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
import {useEffect, useState} from "react";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import EditIcon from "@mui/icons-material/Edit";
import {updateGuest} from "../../../api/resources/guests";
import {Guest, ApiResponse} from "@hotel-management-system/models"
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {makeApiRequest} from "../../../api/makeApiRequest";

interface EditGuestDialogProps {
    guest: Guest | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshGuests: () => void;
}

const EditGuestDialog = (props: EditGuestDialogProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChangedSomething, setHasChangedSomething] = useState(false);

    const resetState = () => {
        //reset all fields
        setFirstName("");
        setLastName("");
        setEmailAddress("");
        setPhoneNumber("");
        setAddress("");
    }

    useEffect(() => {
        setFirstName(props.guest?.firstName || "");
        setLastName(props.guest?.lastName || "");
        setEmailAddress(props.guest?.email || "");
        setPhoneNumber(props.guest?.phoneNumber || "");
        setAddress(props.guest?.address || "");
    }, [props.guest, props.open])

    useEffect(() => {
        if (
            firstName !== props.guest?.firstName ||
            lastName !== props.guest?.lastName ||
            phoneNumber !== props.guest?.phoneNumber ||
            emailAddress !== props.guest?.email ||
            address !== props.guest?.address
        ) {
            setSaveButtonDisabled(false);
            setHasChangedSomething(true);
        } else {
            setSaveButtonDisabled(true);
            setHasChangedSomething(false);
        }
    }, [
        firstName,
        lastName,
        phoneNumber,
        emailAddress,
        address
    ]);

    const handleEditGuest = () => {
        setIsSubmitting(true);
        const newGuest: Guest = {
            guestId: props.guest?.guestId || 0,
            firstName: firstName,
            lastName: lastName,
            email: emailAddress,
            phoneNumber: phoneNumber,
            address: address,
        };

        makeApiRequest<Guest>(
            updateGuest(newGuest),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshGuests();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Guest updated successfully",
                        severity: "success",
                    })
                );
            },
            () => {
                setIsSubmitting(false);
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
            <DialogHeader title={`Editing Guest: ${props.guest?.firstName} ${props.guest?.lastName}`}
                          onClose={handleClose}/>
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
                        startIcon={<EditIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleEditGuest}
                    >
                        {isSubmitting ? "Updating guest..." : "Edit Guest"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default EditGuestDialog;
