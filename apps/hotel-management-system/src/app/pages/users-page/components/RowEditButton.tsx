import {GridCellParams} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {useAppDispatch} from "../../../redux/hooks";
import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export const RowEditButton = (props: {
    params: GridCellParams,
    fetchUsers: () => void
}) => {
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    return (
        <IconButton size={"small"} >
            <EditIcon fontSize={"inherit"}/>
        </IconButton>
    )

}