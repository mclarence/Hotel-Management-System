import { ApiResponse, Guest } from "@hotel-management-system/models";
import { useAppDispatch } from "../../app/redux/hooks";
import { useState } from "react";
import { searchGuests } from "../../app/api/guests";
import appStateSlice from "../../app/redux/slices/AppStateSlice";
import { Autocomplete, TextField } from "@mui/material";

export const GuestAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<Guest | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Guest[]>([]);
    const dispatch = useAppDispatch();
    
    const handleAutoCompleteTypingChange = (event: any) => {
        searchGuests(event.target.value)
        .then((response) => {
          return response.json();
        })
        .then((data: ApiResponse<Guest[]>) => {
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