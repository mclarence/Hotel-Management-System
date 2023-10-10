import {ApiResponse, Guest, PaymentMethod} from "@hotel-management-system/models";
import {useAppDispatch} from "../../app/redux/hooks";
import {useEffect, useState} from "react";
import appStateSlice from "../../app/redux/slices/AppStateSlice";
import {Autocomplete, TextField} from "@mui/material";
import {getPaymentMethodsByGuestId} from "../../app/api/resources/paymentMethods";

export const GuestPaymentMethodAutoCompleteBox = (props: {
    guest: Guest | null,
    value: React.Dispatch<React.SetStateAction<PaymentMethod | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<PaymentMethod[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.guest !== null) {
            getPaymentMethodsByGuestId(props.guest?.guestId as number)
                .then((response) => {
                    return response.json();
                })
                .then((data: ApiResponse<PaymentMethod[]>) => {
                    if (data.success) {
                        setAutoCompleteOptions(data.data);
                    } else if (!data.success && data.statusCode === 401) {
                        dispatch(
                            appStateSlice.actions.setSnackBarAlert({
                                show: true,
                                message: data.message,
                                severity: "warning",
                            })
                        );
                    } else {
                        if (data.statusCode === 400) {
                            setAutoCompleteOptions([]);
                            return;
                        }
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
                });
        } else {
            setAutoCompleteOptions([]);
        }
    }, [props.guest]);

    const handleAutoCompleteSelectionChange = (event: any, value: PaymentMethod | null) => {
        props.value(value);
    }

    return (
        <Autocomplete
            fullWidth
            getOptionLabel={(option) => option.paymentMethodId + " - " + option.type}
            isOptionEqualToValue={(option, value) => option.guestId === value.guestId}
            onChange={handleAutoCompleteSelectionChange}
            id="combo-box-demo"
            options={autoCompleteOptions}
            renderInput={(params) => (
                <TextField  {...params} label="Payment Method"/>
            )}
        />
    )
}