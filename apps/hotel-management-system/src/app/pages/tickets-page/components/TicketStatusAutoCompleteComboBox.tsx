import {RoomStatuses, TicketStatuses} from "@hotel-management-system/models";
import React, {Dispatch, SetStateAction, SyntheticEvent} from "react";
import {Autocomplete, TextField} from "@mui/material";

export const TicketStatusAutoCompleteBox = (props: {
    currentValue: TicketStatuses,
    setValue: Dispatch<SetStateAction<TicketStatuses>>
}) => {

    const handleStatusChange = (event: SyntheticEvent, value: TicketStatuses | null) =>
    {
        if (value !== null) {
            props.setValue(value as TicketStatuses);
        }
    }

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            value={props.currentValue}
            onChange={handleStatusChange}
            options={Object.values(TicketStatuses)}
            renderInput={(params) => <TextField {...params} label="Status"/>}
        />
    )
}