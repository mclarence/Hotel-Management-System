import {Paper} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ApiResponse, User} from "@hotel-management-system/models";
import React, {useEffect, useRef, useState} from "react";
import {deleteUser, getUsers} from "../../api/users";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../redux/hooks";
import appStateSlice from "../../redux/slices/AppStateSlice";
import SpeedDial from '@mui/material/SpeedDial';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {AddUserDialog} from "./components/AddUserDialog";
import {CustomNoRowsOverlay} from "../../../util/CustomNoRowsOverlay";
import {EditUserDialog} from "./components/EditUserDialog";
import { RowDeleteButton } from "../../../util/RowDeleteButton";
import { RowEditButton } from "../../../util/RowEditButton";


export const UsersPage = () => {

    const [rows, setRows] = useState<User[]>([]);
    const [openAddUserDialog, setOpenAddUserDialog] = useState<boolean>(false);
    const [openEditUserDialog, setOpenEditUserDialog] = useState<boolean>(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!appState.loggedIn) {
            navigate('/login')
        }
    }, [appState.loggedIn]);

    const handleEditClick = (user: User) => {
        setSelectedUserForEdit(user);
        setOpenEditUserDialog(true);
    }

    const fetchUsers = () => {
        setIsLoading(true)
        getUsers().then((response) => {
            return response.json();
        })
            .then((data: ApiResponse<User[]>) => {
                if (data.statusCode === 401 && !data.success) {
                    console.log(data.message);
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: data.message,
                        severity: 'warning'
                    }))
                } else if (!data.success) {
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: data.message,
                        severity: 'error'
                    }))
                }

                setRows(data.data);
            })
            .catch((error) => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: error.message,
                    severity: 'error'
                }))
            }).finally(() => {
            setIsLoading(false)
        })
    }

    const handleDeleteSingleUser = (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

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
                    fetchUsers();
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
        })
    }


    const refreshUsers = () => {
        fetchUsers();
    }

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Users'));
        dispatch(appStateSlice.actions.setLastPageVisited('/users'));
        // fetch users
        fetchUsers();

    }, []);


    const columns = useRef(
        [
            {field: 'userId', headerName: 'User ID'},
            {field: 'firstName', headerName: 'First Name'},
            {field: 'lastName', headerName: 'Last Name'},
            {field: 'username', headerName: 'Username'},
            {field: 'email', headerName: 'Email'},
            {field: 'roleId', headerName: 'Role ID'},
            {
                field: 'actions',
                headerName: '',
                sortable: false,
                filterable: false,
                hideable: false,
                disableReorder: true,
                disableColumnMenu: true,
                renderCell: (params: any) => (
                    <>
                        <RowDeleteButton params={params} deleteFunction={handleDeleteSingleUser} idField="userId"/>
                        <RowEditButton onClick={() => handleEditClick(params.row)}/>
                    </>
                )
            },
        ] as GridColDef[]
    );

    return (
        <>
            <Paper sx={{padding: 2}}>
                <AddUserDialog open={openAddUserDialog} setOpen={setOpenAddUserDialog} refreshUsers={refreshUsers}/>
                <EditUserDialog open={openEditUserDialog}setOpen={setOpenEditUserDialog} user={selectedUserForEdit} refreshUsers={refreshUsers}/>
                <DataGrid
                    density={'compact'}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={rows}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => {
                        return row.userId;
                    }}
                    autoHeight={true}
                    sx={{height: '100%'}}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </Paper>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: 'fixed', bottom: 16, right: 16}}
                onClick={() => {
                    setOpenAddUserDialog(true)
                }}
                icon={
                    <PersonAddIcon/>
                }
            >
            </SpeedDial>

        </>
    )
}