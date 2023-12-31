import {Paper, SpeedDial} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect, useRef, useState} from "react";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import {Room} from "@hotel-management-system/models";
import AddIcon from '@mui/icons-material/Add';
import appStateSlice from "../../redux/slices/AppStateSlice";
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {deleteRoom, getRooms} from "../../api/resources/rooms";
import {AddRoomDialog} from "./components/AddRoomDialog";
import {RowEditButton} from "../../../util/components/RowEditButton";
import {RowDeleteButton} from "../../../util/components/RowDeleteButton";
import EditRoomDialog from "./components/EditRoomDialog";
import {makeApiRequest} from "../../api/makeApiRequest";

export const RoomsPage = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<Room[]>([]);
    const [openAddRoomDialog, setOpenAddRoomDialog] = useState<boolean>(false);
    const [openEditRoomDialog, setOpenEditRoomDialog] = useState<boolean>(false);
    const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const handleDeleteButtonClicked = (roomId: number) => {
        if (!window.confirm("Are you sure you want to delete this room?")) {
            return;
        }

        makeApiRequest<null>(
            deleteRoom(roomId),
            dispatch,
            (data) => {
                fetchRooms();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Room deleted successfully",
                        severity: "success",
                    })
                );
            }
        )
    }

    const handleEditButtonClicked = (room: Room) => () => {
        setRoomToEdit(room);
        setOpenEditRoomDialog(true);
    }

    const columns = useRef(
        [
            {field: 'roomId', headerName: 'Room ID', flex: 1},
            {field: 'roomCode', headerName: 'Room Code', flex: 1},
            {field: 'pricePerNight', headerName: 'Price Per Night', flex: 1},
            {field: 'description', headerName: 'Description', flex: 1},
            {field: 'status', headerName: 'Status', flex: 1},
            {
                field: "actions",
                flex: 1,
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
        setIsLoading(true)
        makeApiRequest<Room[]>(
            getRooms(),
            dispatch,
            (data) => {
                setRows(data);
                setIsLoading(false)
            }
        )
    }

    useEffect(() => {
        fetchRooms();
    }, []);


    return (
        <>
            <Paper sx={{padding: 2}}>
                <AddRoomDialog open={openAddRoomDialog} setOpen={setOpenAddRoomDialog} refreshRooms={fetchRooms}/>
                <EditRoomDialog open={openEditRoomDialog} setOpen={setOpenEditRoomDialog} refreshRooms={fetchRooms}
                                room={roomToEdit}/>
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
