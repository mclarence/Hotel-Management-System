import {ApiResponse, Guest, User} from "@hotel-management-system/models";
import { useAppDispatch } from "../app/redux/hooks";
import { useState } from "react";
import { searchGuests } from "../app/api/guests";
import appStateSlice from "../app/redux/slices/AppStateSlice";
import { Autocomplete, TextField } from "@mui/material";
import {searchUser} from "../app/api/users";

export const UserAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<User | null>>
    currentValue: User | null
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<User[]>([]);
    const dispatch = useAppDispatch();
    
    const handleAutoCompleteTypingChange = (event: any) => {
        searchUser(event.target.value)
        .then((response) => {
          return response.json();
        })
        .then((data: ApiResponse<User[]>) => {
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
              isOptionEqualToValue={(option, value) => option.userId === value.userId}
              onChange={handleAutoCompleteSelectionChange}
                value={props.currentValue}
              id="combo-box-demo"
              options={autoCompleteOptions}
              renderInput={(params) => (
                <TextField  {...params} label="User First/Last Name" onChange={handleAutoCompleteTypingChange} />
              )}
            />
    )
}