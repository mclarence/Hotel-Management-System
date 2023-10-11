import { ApiResponse, Guest } from "@hotel-management-system/models";
import { useAppDispatch } from "../../app/redux/hooks";
import { useState } from "react";
import { searchGuests } from "../../app/api/resources/guests";
import appStateSlice from "../../app/redux/slices/AppStateSlice";
import { Autocomplete, TextField } from "@mui/material";
import {makeApiRequest} from "../../app/api/makeApiRequest";

export const GuestAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<Guest | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Guest[]>([]);
    const dispatch = useAppDispatch();
    
    const handleAutoCompleteTypingChange = (event: any) => {
        if (event.target.value) {
            makeApiRequest<Guest[]>(
                searchGuests(event.target.value),
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
              getOptionLabel={(option) => option.firstName + " " + option.lastName}
              isOptionEqualToValue={(option, value) => option.guestId === value.guestId}
              onChange={handleAutoCompleteSelectionChange}
              id="combo-box-demo"
              options={autoCompleteOptions}
              renderInput={(params) => (
                <TextField  {...params} label="Guest Name" onChange={handleAutoCompleteTypingChange} />
              )}
            />
    )
}