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

export const RowDeleteButton = (props: {
    params: GridCellParams,
    fetchUsers: () => void
}) => {
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeleteSingleUser = (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }
        setIsDeleting(true);
        deleteUser(userId).then((response) => {
            return response.json();
        })
            .then((data: ApiResponse<User>) => {
                if (data.success) {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "User deleted successfully",
                        severity: 'success'
                    }))
                    props.fetchUsers();
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
        <IconButton size={"small"} color={"error"} onClick={() => handleDeleteSingleUser(props.params.row.userId)}
                    disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={20}/> : <PersonRemoveIcon fontSize={"inherit"}/>}
        </IconButton>
    )

}