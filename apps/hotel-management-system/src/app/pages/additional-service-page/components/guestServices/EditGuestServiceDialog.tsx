import {Button, Dialog, DialogContent, Stack, TextField, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import {DialogHeader} from "../../../../../util/components/DialogHeader";
import {GuestService} from "@hotel-management-system/models"
import appStateSlice from "../../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../../redux/hooks";
import {makeApiRequest} from "../../../../api/makeApiRequest";
import {updateGuestService} from "../../../../api/resources/guestServices";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";

interface EditGuestServiceDialogProps {
    guestService: GuestService | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshGuestServices: () => void;
}

export const EditGuestServiceDialog = (props: EditGuestServiceDialogProps) => {
    const [serviceDescription, setServiceDescription] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [serviceQuantity, setServiceQuantity] = useState(0);

    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChangedSomething, setHasChangedSomething] = useState(false);

    const resetState = () => {
        //reset all fields
        setServiceDescription("");
        setServicePrice(0);
        setServiceQuantity(0);
    }

    useEffect(() => {
        setServiceDescription(props.guestService?.serviceDescription || "");
        setServicePrice(props.guestService?.servicePrice || 0);
        setServiceQuantity(props.guestService?.serviceQuantity || 0);
    }, [props.guestService, props.open])

    useEffect(() => {
        if (
            serviceDescription !== props.guestService?.serviceDescription ||
            servicePrice !== props.guestService?.servicePrice ||
            serviceQuantity !== props.guestService?.serviceQuantity
        ) {
            setSaveButtonDisabled(false);
            setHasChangedSomething(true);
        } else {
            setSaveButtonDisabled(true);
            setHasChangedSomething(false);
        }
    }, [
        serviceDescription,
        servicePrice,
        serviceQuantity
    ]);

    const handleEditGuestService = () => {
        setIsSubmitting(true);
        const newGuestService: GuestService = {
            serviceId: props.guestService?.serviceId || 0,
            serviceDescription: serviceDescription,
            servicePrice: servicePrice,
            serviceQuantity: serviceQuantity
        };

        makeApiRequest<GuestService>(
            updateGuestService(newGuestService),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshGuestServices();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Guest service updated successfully",
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
            <DialogHeader title={"Update Guest Service"} onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography component={'span'} variant={"subtitle2"}>Service Details</Typography>
                    <TextField
                        fullWidth
                        required
                        label="Description"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        value={servicePrice}
                        type={"number"}
                        inputProps={{
                            min: 0,
                            step: 0.01,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        onChange={(e) => setServicePrice(parseFloat(e.target.value))}
                    />
                    <TextField
                        fullWidth
                        label="Quantity"
                        value={serviceQuantity}
                        type={"number"}
                        inputProps={{
                            min: -1
                        }}
                        onChange={(e) => setServiceQuantity(parseFloat(e.target.value))}
                    />
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<AddIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleEditGuestService}
                    >
                        {isSubmitting ? "Updating service..." : "Edit Service"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default EditGuestServiceDialog;
