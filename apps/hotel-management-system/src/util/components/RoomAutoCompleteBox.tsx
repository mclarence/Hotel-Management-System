import {ApiResponse, Room} from "@hotel-management-system/models";
import {useAppDispatch} from "../../app/redux/hooks";
import {useState} from "react";
import appStateSlice from "../../app/redux/slices/AppStateSlice";
import {Autocomplete, TextField} from "@mui/material";
import {searchRoom} from "../../app/api/resources/rooms";
import {makeApiRequest} from "../../app/api/makeApiRequest";

export const RoomAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<Room | null>>
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<Room[]>([]);
    const dispatch = useAppDispatch();

    const handleAutoCompleteTypingChange = (event: any) => {
        if (event.target.value) {
            makeApiRequest<Room[]>(
                searchRoom(event.target.value),
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
            getOptionLabel={(option) => option.roomCode}
            isOptionEqualToValue={(option, value) => option.roomCode === value.roomCode}
            onChange={handleAutoCompleteSelectionChange}
            id="combo-box-demo"
            options={autoCompleteOptions}
            renderInput={(params) => (
                <TextField  {...params} label="Room Code" onChange={handleAutoCompleteTypingChange}/>
            )}
        />
    )
}