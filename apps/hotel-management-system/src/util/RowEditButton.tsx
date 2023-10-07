import {GridCellParams} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export const RowEditButton = (props: {
    onClick: (e: any) => void,
}) => {

    return (
        <IconButton size={"small"} onClick={props.onClick}>
            <EditIcon fontSize={"inherit"}/>
        </IconButton>
    )

}