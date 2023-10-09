import {RoomStatuses} from "@hotel-management-system/models";
import React, {Dispatch, SetStateAction, SyntheticEvent} from "react";
import {Autocomplete, TextField} from "@mui/material";

export const StatusAutoCompleteComboBox = (props: {
    currentValue: RoomStatuses,
    setValue: Dispatch<SetStateAction<RoomStatuses>>
}) => {

    const handleStatusChange = (event: SyntheticEvent, value: RoomStatuses | null) =>
    {
        if (value !== null) {
            props.setValue(value as RoomStatuses);
        }
    }

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            value={props.currentValue}
            onChange={handleStatusChange}
            options={Object.values(RoomStatuses)}
            renderInput={(params) => <TextField {...params} label="Status"/>}
        />
    )
}