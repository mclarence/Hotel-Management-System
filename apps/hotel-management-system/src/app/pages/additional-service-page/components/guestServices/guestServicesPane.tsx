import {useEffect, useRef, useState} from "react";
import {GuestService} from "@hotel-management-system/models";
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store";
import {useAppDispatch} from "../../../../redux/hooks";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {makeApiRequest} from "../../../../api/makeApiRequest";
import {Paper, SpeedDial} from "@mui/material";
import {CustomNoRowsOverlay} from "../../../../../util/components/CustomNoRowsOverlay";
import AddIcon from "@mui/icons-material/Add";
import {deleteGuestService, getGuestServices} from "../../../../api/resources/guestServices";
import AddGuestServiceDialog from "./AddGuestServiceDialog";
import appStateSlice from "../../../../redux/slices/AppStateSlice";
import {RowDeleteButton} from "../../../../../util/components/RowDeleteButton";
import {RowEditButton} from "../../../../../util/components/RowEditButton";
import EditGuestServiceDialog from "./EditGuestServiceDialog";

export const GuestServicesPane = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<GuestService[]>([]);
    const [openAddGuestServiceDialog, setOpenAddGuestServiceDialog] = useState<boolean>(false);
    const [openEditGuestServiceDialog, setOpenEditGuestServiceDialog] = useState<boolean>(false);
    const [selectedServiceForEdit, setSelectedServiceForEdit] = useState<GuestService | null>(null);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const columns = useRef([
        {field: 'serviceId', headerName: 'Service ID', width: 150},
        {field: 'serviceDescription', headerName: 'Service Description', width: 150},
        {
            field: 'servicePrice', headerName: 'Service Price', width: 150, renderCell: (params) => {
                if (params.row.servicePrice === 0) {
                    return "Free"
                } else {
                    return `$${params.row.servicePrice}`
                }
            }
        },
        {
            field: 'serviceQuantity', headerName: 'Quantity', width: 150, renderCell: (params) => {
                if (params.row.serviceQuantity === -1) {
                    return "Unlimited"
                } else {
                    return params.row.serviceQuantity
                }
            }
        },
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
                        idField="serviceId"
                        deleteFunction={handleDeleteGuestService}
                    />
                    <RowEditButton onClick={handleEditButtonClicked(params.row)}/>
                </>
            ),
        },
    ] as GridColDef[])

    const handleEditButtonClicked = (service: GuestService) => () => {
        setSelectedServiceForEdit(service);
        setOpenEditGuestServiceDialog(true)
    }

    const fetchGuestServices = () => {
        setIsLoading(true)
        makeApiRequest<GuestService[]>(
            getGuestServices(),
            dispatch,
            (data) => {
                setRows(data);
                setIsLoading(false)
            }
        )
    };

    const handleDeleteGuestService = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this guest service?")) {
            return;
        }

        makeApiRequest<null>(
            deleteGuestService(id),
            dispatch,
            (data) => {
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Guest service deleted successfully",
                        severity: "success",
                    })
                );
                fetchGuestServices();
            }
        )
    }

    useEffect(() => {
        fetchGuestServices();
    }, []);

    return (
        <>
            <AddGuestServiceDialog open={openAddGuestServiceDialog} setOpen={setOpenAddGuestServiceDialog}
                                   refreshGuestServices={fetchGuestServices}/>
            <EditGuestServiceDialog open={openEditGuestServiceDialog} setOpen={setOpenEditGuestServiceDialog}
                                    refreshGuestServices={fetchGuestServices} guestService={selectedServiceForEdit}/>
            <Paper sx={{padding: 2}}>
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
                    autoHeight={true}
                    sx={{height: '100%'}}
                    getRowId={(row: any) => {
                        return row.serviceId;
                    }}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
                <SpeedDial
                    ariaLabel='SpeedDial basic example'
                    sx={{position: 'fixed', bottom: 16, right: 16}}
                    onClick={() => setOpenAddGuestServiceDialog(true)}
                    icon={<AddIcon/>}
                ></SpeedDial>
            </Paper>
        </>
    )
}