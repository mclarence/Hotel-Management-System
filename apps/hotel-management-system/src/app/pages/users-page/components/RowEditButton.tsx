import {GridCellParams} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {useAppDispatch} from "../../../redux/hooks";
import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "@hotel-management-system/models";

export const RowEditButton = (props: {
    params: GridCellParams,
    fetchUsers: () => void,
    setSelectedUserForEdit: (user: User | null) => void,
    setShowEditUserDialog: (show: boolean) => void,
}) => {
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const handleEditClick = (e: any) => {
        e.stopPropagation();
        props.setSelectedUserForEdit(props.params.row as User);
        props.setShowEditUserDialog(true);
    }

    return (
        <IconButton size={"small"} onClick={handleEditClick}>
            <EditIcon fontSize={"inherit"}/>
        </IconButton>
    )

}