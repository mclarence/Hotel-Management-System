import { ApiResponse, Room } from "@hotel-management-system/models";
import { useAppDispatch } from "../app/redux/hooks";
import { useState } from "react";
import appStateSlice from "../app/redux/slices/AppStateSlice";
import { Autocomplete, TextField } from "@mui/material";
import { searchRoom } from "../app/api/rooms";

export const RoomAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<Room | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Room[]>([]);
    const dispatch = useAppDispatch();
    
    const handleAutoCompleteTypingChange = (event: any) => {
        searchRoom(event.target.value)
        .then((response) => {
          return response.json();
        })
        .then((data: ApiResponse<Room[]>) => {
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
              getOptionLabel={(option) => option.roomCode}
              isOptionEqualToValue={(option, value) => option.roomCode === value.roomCode}
              onChange={handleAutoCompleteSelectionChange}
              id="combo-box-demo"
              options={autoCompleteOptions}
              renderInput={(params) => (
                <TextField  {...params} label="Room Code" onChange={handleAutoCompleteTypingChange} />
              )}
            />
    )
}