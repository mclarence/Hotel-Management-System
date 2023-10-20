import {GuestService} from "@hotel-management-system/models";
import {useAppDispatch} from "../../app/redux/hooks";
import {useState} from "react";
import {Autocomplete, TextField} from "@mui/material";
import {makeApiRequest} from "../../app/api/makeApiRequest";
import {searchGuestServices} from "../../app/api/resources/guestServices";

export const GuestServiceAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<GuestService | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<GuestService[]>([]);
    const dispatch = useAppDispatch();

    const handleAutoCompleteTypingChange = (event: any) => {
        if (event.target.value) {
            makeApiRequest<GuestService[]>(
                searchGuestServices(event.target.value),
                dispatch,
                (data) => {
                    setAutoCompleteOptions(data);
                }
            )
        }

    }

    const handleAutoCompleteSelectionChange = (event: any, value: any) => {
        props.value(value);
    }

    return (
        <Autocomplete
            fullWidth
            getOptionLabel={(option) => option.serviceDescription}
            isOptionEqualToValue={(option, value) => option.serviceId === value.serviceId}
            onChange={handleAutoCompleteSelectionChange}
            id="combo-box-demo"
            options={autoCompleteOptions}
            renderInput={(params) => (
                <TextField  {...params} label="Guest Service" onChange={handleAutoCompleteTypingChange}/>
            )}
        />
    )
}