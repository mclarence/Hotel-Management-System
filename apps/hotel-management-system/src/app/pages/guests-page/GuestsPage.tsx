import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { RootState } from "../../redux/store";
import { Guest, ApiResponse } from "@hotel-management-system/models";
import { Paper, SpeedDial } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CustomNoRowsOverlay } from "../../../util/CustomNoRowsOverlay";
import AddIcon from "@mui/icons-material/Add";
import { deleteGuest, getGuests } from "../../api/guests";
import appStateSlice from "../../redux/slices/AppStateSlice";
import { RowDeleteButton } from "../../../util/RowDeleteButton";
import AddGuestDialog from "./components/AddGuestDialog";

const GuestsPage = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddGuestDialog, setOpenAddGuestDialog] = useState(false);
  const appState = useSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchGuests = () => {
    getGuests()
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<Guest[]>) => {
        if (data.success) {
          setGuests(data.data);
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
  };

  const handleDeleteGuest = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) {
      return;
    }

    deleteGuest(id)
      .then((response) => {
        return response.json();
      })
      .then((data: ApiResponse<null>) => {
        if (data.success) {
          dispatch(
            appStateSlice.actions.setSnackBarAlert({
              show: true,
              message: "Guest deleted successfully",
              severity: "success",
            })
          );
          fetchGuests();
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
      .catch((error) => {
        dispatch(
          appStateSlice.actions.setSnackBarAlert({
            show: true,
            message: error.message,
            severity: "error",
          })
        );
      })
      .finally(() => {});
  };

  useEffect(() => {
    dispatch(appStateSlice.actions.setAppBarTitle("Guests"));
    dispatch(appStateSlice.actions.setLastPageVisited("/guests"));
    fetchGuests();
  }, []);

  const columns = useRef([
    { field: "guestId", headerName: "Guest ID" },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      hideable: false,
      disableReorder: true,
      disableColumnMenu: true,
      renderCell: (params: any) => (
        <RowDeleteButton
          params={params}
          idField="guestId"
          deleteFunction={handleDeleteGuest}
        />
      ),
    },
  ] as GridColDef[]);

  return (
    <>
      <Paper sx={{ padding: 2 }}>
        <AddGuestDialog open={openAddGuestDialog} setOpen={setOpenAddGuestDialog} refreshGuests={fetchGuests} />
        <DataGrid
          density={"compact"}
          disableRowSelectionOnClick={true}
          checkboxSelection={false}
          rows={guests}
          columns={columns.current}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => {
            return row.guestId;
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
        onClick={() => {
          setOpenAddGuestDialog(true);
        }}
        icon={<AddIcon />}
      ></SpeedDial>
    </>
  );
};

export default GuestsPage;
