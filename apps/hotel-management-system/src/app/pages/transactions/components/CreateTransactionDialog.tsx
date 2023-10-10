import {Button, Dialog, DialogContent, Stack, TextField} from "@mui/material";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {useAppDispatch} from "../../../redux/hooks";
import {GuestAutoCompleteBox} from "../../../../util/components/GuestAutoCompleteBox";
import React, {useEffect, useState} from "react";
import {GuestPaymentMethodAutoCompleteBox} from "../../../../util/components/GuestPaymentMethodAutoCompleteBox";
import {Guest, PaymentMethod, Transaction} from "@hotel-management-system/models";
import InputAdornment from '@mui/material/InputAdornment';
import {DateTimePicker} from "@mui/x-date-pickers";
import {createTransaction} from "../../../api/transactions";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {handleApiResponse} from "../../../api/handleApiResponse";

export const CreateTransactionDialog = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
    fetchTransactions: () => void
}) => {
    const dispatch = useAppDispatch();
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true);
    const [transactionDate, setTransactionDate] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    useEffect(() => {
        if (
            selectedGuest !== null &&
            amount !== null &&
            description !== null &&
            paymentMethod !== null &&
            transactionDate !== null
        ) {
            setSaveButtonDisabled(false);
        } else {
            setSaveButtonDisabled(true);
        }
    }, [selectedGuest, amount, description, paymentMethod, transactionDate])

    const resetState = () => {
        setSelectedGuest(null);
        setAmount(null);
        setDescription(null);
        setPaymentMethod(null);
        setTransactionDate(null);
    }

    const handleSubmit = () => {
        if (
            selectedGuest !== null &&
            amount !== null &&
            description !== null &&
            paymentMethod !== null &&
            transactionDate !== null
        ) {
            const transaction: Transaction = {
                paymentMethodId: paymentMethod.paymentMethodId!,
                guestId: selectedGuest.guestId!,
                amount: amount,
                description: description,
                date: transactionDate!
            }
            setIsSubmitting(true)
            handleApiResponse<Transaction>(
                createTransaction(transaction),
                dispatch,
                (data) => {
                    props.setOpen(false);
                    resetState();
                    props.fetchTransactions();
                    dispatch(
                        appStateSlice.actions.setSnackBarAlert({
                            show: true,
                            message: "Transaction added successfully",
                            severity: "success",
                        })
                    );
                }
            )
        }
    }

    return (
        <>
            <Dialog open={props.open}>
                <DialogHeader title={"Add Transaction"} onClose={() => props.setOpen(false)}/>
                <DialogContent>
                    <Stack gap={2}>
                        <GuestAutoCompleteBox value={setSelectedGuest}/>
                        <GuestPaymentMethodAutoCompleteBox guest={selectedGuest} value={setPaymentMethod}/>
                        <TextField
                            fullWidth
                            label={"Amount"}
                            type={"number"}
                            value={amount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                        <TextField
                            fullWidth
                            label={"Description"}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <DateTimePicker
                            format={"DD/MM/YYYY hh:mm A"}
                            value={transactionDate}
                            timezone={"Australia/Sydney"}
                            onChange={(newValue) => {
                                setTransactionDate(newValue);
                            }}
                        />
                        <Button variant={"contained"} disabled={saveButtonDisabled} onClick={handleSubmit}>
                            Add Transaction
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    )
}