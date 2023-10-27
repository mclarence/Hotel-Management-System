import {GuestService} from "@hotel-management-system/models";
import AddIcon from "@mui/icons-material/Add";
import {Button, Dialog, DialogContent, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {DialogHeader} from "../../../../../util/components/DialogHeader";
import {useAppDispatch} from "../../../../redux/hooks";
import appStateSlice from "../../../../redux/slices/AppStateSlice";
import {makeApiRequest} from "../../../../api/makeApiRequest";
import {addGuestService} from "../../../../api/resources/guestServices";
import InputAdornment from "@mui/material/InputAdornment";

interface AddGuestServiceDialog {
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshGuestServices: () => void;
}

const AddGuestServiceDialog = (props: AddGuestServiceDialog) => {
    const [serviceDescription, setServiceDescription] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [serviceQuantity, setServiceQuantity] = useState(0);

    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetState = () => {
        //reset all fields
        setServiceDescription("");
        setServicePrice(0);
        setServiceQuantity(0);
    }

    useEffect(() => {
        if (
            serviceDescription === ""
        ) {
            setSaveButtonDisabled(true);
        } else {
            setSaveButtonDisabled(false);
        }
    }, [serviceDescription, servicePrice, serviceQuantity]);

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleAddGuestService = () => {
        setIsSubmitting(true);
        const newGuestService: GuestService = {
            serviceDescription: serviceDescription,
            servicePrice: servicePrice,
            serviceQuantity: serviceQuantity
        };

        makeApiRequest<GuestService>(
            addGuestService(newGuestService),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshGuestServices();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Guest service added successfully",
                        severity: "success",
                    })
                );
            },
            () => {
                setIsSubmitting(false);
            }
        )
    };

    return (
        <Dialog open={props.open} fullWidth>
            <DialogHeader title={"Add Guest Service"} onClose={handleClose}/>
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
                        onClick={handleAddGuestService}
                    >
                        {isSubmitting ? "Adding service..." : "Add Service"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default AddGuestServiceDialog;
