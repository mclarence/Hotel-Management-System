import {ApiResponse, Guest, PaymentMethod, Reservation} from "@hotel-management-system/models";
import {useAppDispatch} from "../../app/redux/hooks";
import {useEffect, useState} from "react";
import appStateSlice from "../../app/redux/slices/AppStateSlice";
import {Autocomplete, TextField} from "@mui/material";
import {getPaymentMethodsByGuestId} from "../../app/api/resources/paymentMethods";
import {makeApiRequest} from "../../app/api/makeApiRequest";
import {searchReservations} from "../../app/api/resources/reservations";
import dayjs from "dayjs";

export const GuestReservationAutoCompleteBox = (props: {
    guest: Guest | null,
    value: React.Dispatch<React.SetStateAction<Reservation | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Reservation[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.guest !== null) {
            makeApiRequest<Reservation[]>(
                searchReservations({
                    guestId: props.guest?.guestId as number,
                }),
                dispatch,
                (data) => {
                    setAutoCompleteOptions(data);
                }
            )
        } else {
            setAutoCompleteOptions([]);
        }
    }, [props.guest]);

    const handleAutoCompleteSelectionChange = (event: any, value: Reservation | null) => {
        props.value(value);
    }

    return (
        <Autocomplete
            fullWidth
            getOptionLabel={(option) => option.reservationId + " - " + dayjs.utc(option.startDate).local().format("DD/MM/YYYY") + " - " + dayjs.utc(option.endDate).local().format("DD/MM/YYYY")}
            isOptionEqualToValue={(option, value) => option.reservationId === value.reservationId}
            onChange={handleAutoCompleteSelectionChange}
            id="combo-box-demo"
            options={autoCompleteOptions}
            renderInput={(params) => (
                <TextField  {...params} label="Reservation"/>
            )}
        />
    )
}