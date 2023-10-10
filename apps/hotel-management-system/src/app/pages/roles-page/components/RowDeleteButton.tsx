import {GridCellParams} from "@mui/x-data-grid";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {useAppDispatch} from "../../../redux/hooks";
import React, {useState} from "react";
import {deleteUser} from "../../../api/users";
import {ApiResponse, User} from "@hotel-management-system/models";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import IconButton from "@mui/material/IconButton";
import {CircularProgress} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteRole } from "../../../api/roles";
export const RowDeleteButton = (props: {
    params: GridCellParams,
    fetchRoles: () => void
}) => {
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeletingSignleRole = (roleId: number) => {
        if (!window.confirm('Are you sure you want to delete this role?')) {
            return;
        }
        setIsDeleting(true);
        deleteRole(roleId).then((response) => {
            return response.json();
        })
            .then((data: ApiResponse<User>) => {
                if (data.success) {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Role deleted successfully",
                        severity: 'success'
                    }))
                    props.fetchRoles();
                } else if (!data.success && data.statusCode === 401) {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: data.message,
                        severity: 'warning'
                    }))
                } else {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: data.message,
                        severity: 'error'
                    }))
                }
            })
            .catch((error) => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: error.message,
                    severity: 'error'
                }))
            }).finally(() => {
            setIsDeleting(false);
        })
    }

    return (
        <IconButton size={"small"} color={"error"} onClick={() => handleDeletingSignleRole(props.params.row.roleId)}
                    disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20}/> : <DeleteIcon fontSize={"inherit"}/>}
        </IconButton>
    )

}