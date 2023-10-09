import IconButton from "@mui/material/IconButton";
import React from "react";
import CreditCardIcon from '@mui/icons-material/CreditCard';
export const PaymentMethodsRowButton = (props: {
    setOpen: (open: boolean) => void
}) => {

    return (
        <IconButton size={"small"} onClick={() => props.setOpen(true)}>
            <CreditCardIcon fontSize={"inherit"}/>
        </IconButton>
    )
}