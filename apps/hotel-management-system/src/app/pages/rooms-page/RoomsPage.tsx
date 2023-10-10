import { Paper, SpeedDial } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { CustomNoRowsOverlay } from "../../../util/CustomNoRowsOverlay";
import {Room, ApiResponse} from "@hotel-management-system/models";
import AddIcon from '@mui/icons-material/Add';
import appStateSlice from "../../redux/slices/AppStateSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { deleteRoom, getRooms } from "../../api/rooms";
import { AddRoomDialog } from "./components/AddRoomDialog";
import { RowEditButton } from "../../../util/RowEditButton";
import { RowDeleteButton } from "../../../util/RowDeleteButton";
import EditRoomDialog from "./components/EditRoomDialog";

export const RoomsPage = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<Room[]>([]);
    const [openAddRoomDialog, setOpenAddRoomDialog] = useState<boolean>(false);
    const [openEditRoomDialog, setOpenEditRoomDialog] = useState<boolean>(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const handleDeleteButtonClicked = (roomId: number) => {
        deleteRoom(roomId)
        .then((response) => {
            return response.json();
          })
          .then((data: ApiResponse<null>) => {
            if (data.success) {
              fetchRooms();
              dispatch(
                appStateSlice.actions.setSnackBarAlert({
                  show: true,
                  message: data.message,
                  severity: "success",
                })
              );
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

    const handleEditButtonClicked = (room: Room) => () => {
        setRoomToEdit(room);
        setOpenEditRoomDialog(true);
    }

    const columns = useRef(
        [
            {field: 'roomId', headerName: 'Room ID'},
            {field: 'roomCode', headerName: 'Room Code'},
            {field: 'pricePerNight', headerName: 'Price Per Night'},
            {field: 'description', headerName: 'Description'},
            {field: 'status', headerName: 'Status'},
            {
              field: "actions",
              headerName: "",
              sortable: false,
              filterable: false,
              hideable: false,
              disableReorder: true,
              disableColumnMenu: true,
              renderCell: (params: any) => (
                <>
                  <RowDeleteButton
                    params={params}
                    idField="roomId"
                    deleteFunction={handleDeleteButtonClicked}/>
                  <RowEditButton onClick={handleEditButtonClicked(params.row)}/>
                </>
              ),
            },
        ]
    )

    const fetchRooms = () => {
        getRooms()
        .then((response) => {
            return response.json();
          })
          .then((data: ApiResponse<Room[]>) => {
            if (data.success) {
              setRows(data.data);
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
        dispatch(appStateSlice.actions.setAppBarTitle('Rooms'));
        dispatch(appStateSlice.actions.setLastPageVisited('/Rooms'));
        fetchRooms();
    }, []);


    return (
        <>
            <Paper sx={{padding: 2}}>
              <AddRoomDialog open={openAddRoomDialog} setOpen={setOpenAddRoomDialog} refreshRooms={fetchRooms}/>
                <EditRoomDialog open={openEditRoomDialog} setOpen={setOpenEditRoomDialog} refreshRooms={fetchRooms} room={roomToEdit}/>
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
                    getRowId={(row: any) => {
                        return row.roomId;
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
                    setOpenAddRoomDialog(true)
                }}
                icon={
                    <AddIcon/>
                }
            >
            </SpeedDial>
        </>
    )
}
