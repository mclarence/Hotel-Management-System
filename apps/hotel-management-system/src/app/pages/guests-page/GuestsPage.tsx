import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../redux/hooks";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {RootState} from "../../redux/store";
import {Guest, ApiResponse} from "@hotel-management-system/models";
import {Paper, SpeedDial} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import AddIcon from "@mui/icons-material/Add";
import {deleteGuest, getGuests} from "../../api/resources/guests";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {RowDeleteButton} from "../../../util/components/RowDeleteButton";
import AddGuestDialog from "./components/AddGuestDialog";
import {RowEditButton} from "../../../util/components/RowEditButton";
import EditGuestDialog from "./components/EditGuestDialog";
import {PaymentMethodsRowButton} from "./components/PaymentMethodsRowButton";
import {PaymentMethodsDialog} from "./components/PaymentMethodsDialog";
import {makeApiRequest} from "../../api/makeApiRequest";

const GuestsPage = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openAddGuestDialog, setOpenAddGuestDialog] = useState(false);
    const [openEditGuestDialog, setOpenEditGuestDialog] = useState<boolean>(false);
    const [openPaymentMethodsDialog, setOpenPaymentMethodsDialog] = useState<boolean>(false);
    const [selectedGuestForEdit, setSelectedGuestForEdit] = useState<Guest | null>(null);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchGuests = () => {
        setIsLoading(true)
        makeApiRequest<Guest[]>(
            getGuests(),
            dispatch,
            (data) => {
                setGuests(data);
                setIsLoading(false)
            }
        )
    };

    const handleDeleteGuest = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this guest?")) {
            return;
        }

        makeApiRequest<null>(
            deleteGuest(id),
            dispatch,
            (data) => {
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Guest deleted successfully",
                        severity: "success",
                    })
                );
                fetchGuests();
            }
        )
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const handleEditButtonClicked = (guest: Guest) => () => {
        setSelectedGuestForEdit(guest);
        setOpenEditGuestDialog(true)
    }

    const handlePaymentMethodsButtonClicked = (guest: Guest) => () => {
        setSelectedGuestForEdit(guest);
        setOpenPaymentMethodsDialog(true)
    }

    const columns = useRef([
        {field: "guestId", headerName: "Guest ID", flex: 1},
        {field: "firstName", headerName: "First Name", width: 200, flex: 1},
        {field: "lastName", headerName: "Last Name", width: 200, flex: 1},
        {field: "email", headerName: "Email", width: 200, flex: 1},
        {field: "phoneNumber", headerName: "Phone Number", width: 200, flex: 1},
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
                        idField="guestId"
                        deleteFunction={handleDeleteGuest}
                    />
                    <RowEditButton onClick={handleEditButtonClicked(params.row)}/>
                    <PaymentMethodsRowButton setOpen={handlePaymentMethodsButtonClicked(params.row)}/>
                </>
            )
            , flex: 1
        },
    ] as GridColDef[]);

    return (
        <>
            <Paper sx={{padding: 2}}>
                <AddGuestDialog
                    open={openAddGuestDialog}
                    setOpen={setOpenAddGuestDialog}
                    refreshGuests={fetchGuests}
                />
                <EditGuestDialog
                    open={openEditGuestDialog}
                    setOpen={setOpenEditGuestDialog}
                    refreshGuests={fetchGuests}
                    guest={selectedGuestForEdit}
                />
                <PaymentMethodsDialog
                    open={openPaymentMethodsDialog}
                    setOpen={setOpenPaymentMethodsDialog}
                    guest={selectedGuestForEdit}
                />
                <DataGrid
                    density={"compact"}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={guests}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => {
                        return row.guestId;
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
                    setOpenAddGuestDialog(true);
                }}
                icon={<AddIcon/>}
            ></SpeedDial>
        </>
    );
};

export default GuestsPage;
