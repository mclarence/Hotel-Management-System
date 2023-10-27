import {Guest, GuestService, GuestServiceOrder, Reservation} from "@hotel-management-system/models";
import AddIcon from "@mui/icons-material/Add";
import {Autocomplete, Button, Dialog, DialogContent, Stack, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {DialogHeader} from "../../../../../util/components/DialogHeader";
import {useAppDispatch} from "../../../../redux/hooks";
import appStateSlice from "../../../../redux/slices/AppStateSlice";
import {makeApiRequest} from "../../../../api/makeApiRequest";
import dayjs, {Dayjs} from "dayjs";
import {GuestServiceOrderStatuses} from "../../../../../../../../libs/models/src/lib/enums/GuestServiceOrderStatuses";
import {addGuestServiceOrder} from "../../../../api/resources/guestServiceOrders";
import {GuestAutoCompleteBox} from "../../../../../util/components/GuestAutoCompleteBox";
import {GuestReservationAutoCompleteBox} from "../../../../../util/components/GuestReservationAutoCompleteBox";
import {GuestServiceAutoCompleteBox} from "../../../../../util/components/GuestServiceAutoCompleteBox";
import {DateTimePicker} from "@mui/x-date-pickers";
import InputAdornment from "@mui/material/InputAdornment";

interface AddGuestServiceOrderDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshGuestServiceOrders: () => void;
}

export const AddGuestServiceOrderDialog = (props: AddGuestServiceOrderDialogProps) => {
    const [guest, setGuest] = useState<Guest | null>(null);
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [service, setService] = useState<GuestService | null>(null);
    const [orderTime, setOrderTime] = useState<Dayjs | null>(dayjs().utc());
    const [orderStatus, setOrderStatus] = useState<GuestServiceOrderStatuses | null>(GuestServiceOrderStatuses.PENDING);
    const [orderPrice, setOrderPrice] = useState(0);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [orderDescription, setOrderDescription] = useState("");

    const dispatch = useAppDispatch();
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetState = () => {
        //reset all fields
        setReservation(null);
        setService(null);
        setOrderTime(dayjs().utc());
        setOrderStatus(GuestServiceOrderStatuses.PENDING);
        setOrderPrice(0);
        setOrderQuantity(0);
        setOrderDescription("");
    }

    useEffect(() => {
        // calculate the order price using the service price and quantity
        if (service !== null) {
            setOrderPrice(service.servicePrice * orderQuantity);
        }
    }, [service, orderQuantity]);

    useEffect(() => {
        if (
            reservation === null ||
            service === null ||
            orderTime === null ||
            orderStatus === null
        ) {
            setSaveButtonDisabled(true);
        } else {
            setSaveButtonDisabled(false);
        }
    }, [reservation, service, orderTime, orderStatus]);

    const handleClose = () => {
        props.setOpen(false);
    };

    const handleAddGuestServiceOrder = () => {
        setIsSubmitting(true);

        if (reservation === null || service === null || orderTime === null || orderStatus === null) {
            return;
        }

        const newGuestServiceOrder: GuestServiceOrder = {
            description: orderDescription,
            orderPrice: orderPrice,
            orderStatus: orderStatus!,
            orderTime: orderTime!.toDate(),
            reservationId: reservation?.reservationId!,
            serviceId: service?.serviceId!,
            orderQuantity: orderQuantity,
        }

        makeApiRequest<GuestServiceOrder>(
            addGuestServiceOrder(newGuestServiceOrder),
            dispatch,
            (data) => {
                props.setOpen(false);
                resetState();
                props.refreshGuestServiceOrders();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Order added successfully",
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
            <DialogHeader title={"Add Guest Service Order"} onClose={handleClose}/>
            <DialogContent>
                <Stack gap={2}>
                    <Typography component={'span'} variant={"subtitle2"}>Order Details</Typography>
                    <GuestAutoCompleteBox value={setGuest}/>
                    <GuestReservationAutoCompleteBox guest={guest} value={setReservation}/>
                    <GuestServiceAutoCompleteBox value={setService}/>
                    <DateTimePicker
                        format={"DD/MM/YYYY hh:mm A"}
                        value={orderTime}
                        timezone={"Australia/Sydney"}
                        onChange={(newValue) => {
                            setOrderTime(newValue);
                        }}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        value={orderStatus}
                        onChange={(event, newValue) => {
                            setOrderStatus(newValue);
                        }}
                        options={Object.values(GuestServiceOrderStatuses)}
                        renderInput={(params) => <TextField {...params} label="Status"/>}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        value={orderPrice}
                        type={"number"}
                        inputProps={{
                            min: 0,
                            step: 0.01,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        onChange={(e) => setOrderPrice(parseFloat(e.target.value))}
                    />
                    <TextField
                        fullWidth
                        label="Quantity"
                        value={orderQuantity}
                        type={"number"}
                        inputProps={{
                            min: 1
                        }}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={orderDescription}
                        onChange={(e) => setOrderDescription(e.target.value)}
                    />
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        startIcon={<AddIcon/>}
                        disabled={saveButtonDisabled || isSubmitting}
                        onClick={handleAddGuestServiceOrder}
                    >
                        {isSubmitting ? "Creating order..." : "Create Order"}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default AddGuestServiceOrderDialog;
