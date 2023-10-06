import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import appStateSlice from "../../redux/slices/AppStateSlice";
import { RootState } from "../../redux/store";
import { ApiResponse, Role } from "@hotel-management-system/models";
import { getRoles } from "../../api/roles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper, SpeedDial } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CustomNoRowsOverlay } from "../../../util/CustomNoRowsOverlay";
import { AddRoleDialog } from "./components/AddRoleDialog";
import { RowDeleteButton } from "./components/RowDeleteButton";
import { useNavigate } from "react-router-dom";

export const RolesPage = () => {
  const [roles, setRoles] = useState([] as Role[]);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddRoleDialog, setOpenAddRoleDialog] = useState(false);
  const appState = useSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!appState.loggedIn) {
        navigate('/login')
    }
}, [appState.loggedIn]);

  const fetchRoles = () => {
    getRoles()
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Role[]>) => {
        if (data.success) {
          setRoles(data.data);
        } else if (!data.success && data.statusCode === 401) {
          dispatch(
            appStateSlice.actions.setSnackBarAlert({
              show: true,
              message: data.message,
              severity: "warning",
            })
          );
        } else {
          dispatch(
            appStateSlice.actions.setSnackBarAlert({
              show: true,
              message: data.message,
              severity: "error",
            })
          );
        }
      })
      .catch(() => {
        dispatch(
          appStateSlice.actions.setSnackBarAlert({
            show: true,
            message: "An unknown error occurred",
            severity: "error",
          })
        );
      });
  }

  useEffect(() => {
    dispatch(appStateSlice.actions.setAppBarTitle("Roles"));
    dispatch(appStateSlice.actions.setLastPageVisited('/roles'));
    fetchRoles();
  }, []);

  const columns = useRef([
    { field: "roleId", headerName: "Role ID" },
    { field: "name", headerName: "Role Name", width: 200 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      hideable: false,
      disableReorder: true,
      disableColumnMenu: true,
      renderCell: (params: any) => <>
        <RowDeleteButton params={params} fetchRoles={fetchRoles}/>
      </>,
    },
  ] as GridColDef[]);

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <AddRoleDialog setOpen={setOpenAddRoleDialog} open={openAddRoleDialog} refreshRoles={fetchRoles}/>
        <DataGrid
          density={"compact"}
          disableRowSelectionOnClick={true}
          checkboxSelection={false}
          rows={roles}
          columns={columns.current}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => {
            return row.roleId;
          }}
          autoHeight={true}
          sx={{ height: "100%" }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Paper>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => {setOpenAddRoleDialog(true)}}
        icon={<AddIcon />}
      ></SpeedDial>
    </>
  );
};
