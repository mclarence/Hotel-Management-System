import {ApiResponse, Guest, User} from "@hotel-management-system/models";
import {useAppDispatch} from "../../app/redux/hooks";
import {useState} from "react";
import {searchGuests} from "../../app/api/resources/guests";
import appStateSlice from "../../app/redux/slices/AppStateSlice";
import {Autocomplete, TextField} from "@mui/material";
import {searchUser} from "../../app/api/resources/users";
import {makeApiRequest} from "../../app/api/makeApiRequest";

export const UserAutoCompleteBox = (props: {
    value: React.Dispatch<React.SetStateAction<User | null>>
    currentValue: User | null
}) => {
    const [autoCompleteOptions, setAutoCompleteOptions] = useState<User[]>([]);
    const dispatch = useAppDispatch();

    const handleAutoCompleteTypingChange = (event: any) => {
        if (event.target.value) {
            makeApiRequest<User[]>(
                searchUser(event.target.value),
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
            isOptionEqualToValue={(option, value) => option.userId === value.userId}
            onChange={handleAutoCompleteSelectionChange}
            value={props.currentValue}
            id="combo-box-demo"
            options={autoCompleteOptions}
            renderInput={(params) => (
                <TextField  {...params} label="User First/Last Name" onChange={handleAutoCompleteTypingChange}/>
            )}
        />
    )
}