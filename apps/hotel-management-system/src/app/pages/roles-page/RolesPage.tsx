import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../redux/hooks";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {RootState} from "../../redux/store";
import {ApiResponse, Role, User} from "@hotel-management-system/models";
import {deleteRole, getRoles} from "../../api/resources/roles";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Paper, SpeedDial} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import {AddRoleDialog} from "./components/AddRoleDialog";
import {useNavigate} from "react-router-dom";
import {RowDeleteButton} from "../../../util/components/RowDeleteButton";
import {makeApiRequest} from "../../api/makeApiRequest";
import {EditRoleDialog} from "./components/EditRoleDialog";
import {RowEditButton} from "../../../util/components/RowEditButton";

export const RolesPage = () => {
    const [roles, setRoles] = useState([] as Role[]);
    const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openAddRoleDialog, setOpenAddRoleDialog] = useState(false);
    const [openEditRoleDialog, setOpenEditRoleDialog] = useState<boolean>(false);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchRoles = () => {
        setIsLoading(true)
        makeApiRequest<Role[]>(
            getRoles(),
            dispatch,
            (data) => {
                setRoles(data);
                setIsLoading(false)
            }
        )
    }

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDeletingSingleRow = (roleId: number) => {
        if (!window.confirm('Are you sure you want to delete this role?')) {
            return;
        }

        makeApiRequest<null>(
            deleteRole(roleId),
            dispatch,
            (data) => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: "Role deleted successfully",
                    severity: 'success'
                }))
                fetchRoles();
            }
        )
    }

    const handleEditRole = (role: Role) => () => {
        setSelectedRoleForEdit(role);
        setOpenEditRoleDialog(true);
    }

    const columns = useRef([
        {field: "roleId", headerName: "Role ID"},
        {field: "name", headerName: "Role Name", width: 200},
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => <>
                <RowDeleteButton params={params} deleteFunction={handleDeletingSingleRow}
                                 idField={"roleId"}/>
                <RowEditButton onClick={handleEditRole(params.row)}/>
            </>
        },
    ] as GridColDef[]);

    return (
        <>
            <Paper sx={{padding: 2}}>
                <AddRoleDialog setOpen={setOpenAddRoleDialog} open={openAddRoleDialog} refreshRoles={fetchRoles}/>
                <EditRoleDialog role={selectedRoleForEdit} open={openEditRoleDialog} setOpen={setOpenEditRoleDialog}
                                refreshRoles={fetchRoles}/>
                <DataGrid
                    density={"compact"}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={roles}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => {
                        return row.roleId;
                    }}
                    autoHeight={true}
                    sx={{height: "100%"}}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </Paper>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: "fixed", bottom: 16, right: 16}}
                onClick={() => {
                    setOpenAddRoleDialog(true)
                }}
                icon={<AddIcon/>}
            ></SpeedDial>
        </>
    );
};
