import {Autocomplete, Button, Dialog, DialogContent, Stack, TextField,} from "@mui/material";
import React, {useEffect, useState} from "react";
import {DialogHeader} from "../../../../../util/components/DialogHeader";
import {GuestServiceOrder} from "@hotel-management-system/models"
import appStateSlice from "../../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../../redux/hooks";
import {makeApiRequest} from "../../../../api/makeApiRequest";
import {GuestServiceOrderStatuses} from "../../../../../../../../libs/models/src/lib/enums/GuestServiceOrderStatuses";
import {updateGuestServiceOrder} from "../../../../api/resources/guestServiceOrders";
import AddIcon from "@mui/icons-material/Add";

interface EditGuestServiceOrderDialog {
    guestServiceOrder: GuestServiceOrder | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshGuestServiceOrders: () => void;
}

export const EditGuestServiceOrderDialog = (props: EditGuestServiceOrderDialog) => {
    const [orderStatus, setOrderStatus] = useState(GuestServiceOrderStatuses.PENDING);

    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChangedSomething, setHasChangedSomething] = useState(false);

    const resetState = () => {
        //reset all fields
        setOrderStatus(GuestServiceOrderStatuses.PENDING);
    }

    useEffect(() => {
        setOrderStatus(props.guestServiceOrder?.orderStatus || GuestServiceOrderStatuses.PENDING);
    }, [props.guestServiceOrder, props.open])

    useEffect(() => {
        if (
            orderStatus !== props.guestServiceOrder?.orderStatus
        ) {
            setSaveButtonDisabled(false);
            setHasChangedSomething(true);
        } else {
            setSaveButtonDisabled(true);
            setHasChangedSomething(false);
        }
    }, [
        orderStatus
    ]);

    const handleEditGuestServiceOrder = () => {
        setIsSubmitting(true);
        const newGuestServiceOrder: GuestServiceOrder = {
            orderId: props.guestServiceOrder?.orderId || 0,
            reservationId: props.guestServiceOrder?.reservationId || 0,
            serviceId: props.guestServiceOrder?.serviceId || 0,
            orderTime: props.guestServiceOrder?.orderTime || new Date(),
            orderStatus: orderStatus,
            orderPrice: props.guestServiceOrder?.orderPrice || 0,
            orderQuantity: props.guestServiceOrder?.orderQuantity || 0,
            description: props.guestServiceOrder?.description || "",
        };

        makeApiRequest<GuestServiceOrder>(
            updateGuestServiceOrder(newGuestServiceOrder),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshGuestServiceOrders();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Order updated successfully",
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
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        value={orderStatus}
                        onChange={(event, newValue) => {
                            setOrderStatus(newValue!);
                        }}
                        options={Object.values(GuestServiceOrderStatuses)}
                        renderInput={(params) => <TextField {...params} label="Status"/>}
                    />
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<AddIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleEditGuestServiceOrder}
                    >
                        {isSubmitting ? "Updating order..." : "Update Order"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default EditGuestServiceOrderDialog;
