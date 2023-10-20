import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Paper, SpeedDial} from "@mui/material";
import {CustomNoRowsOverlay} from "../../../../../util/components/CustomNoRowsOverlay";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useRef, useState} from "react";
import {GuestServiceOrder} from "@hotel-management-system/models";
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store";
import {dateValueFormatter} from "../../../../../util/dateValueFormatter";
import {makeApiRequest} from "../../../../api/makeApiRequest";
import {deleteGuestServiceOrder, getGuestServiceOrders} from "../../../../api/resources/guestServiceOrders";
import {useAppDispatch} from "../../../../redux/hooks";
import AddGuestServiceOrderDialog from "./AddGuestServiceOrderDialog";
import {RowDeleteButton} from "../../../../../util/components/RowDeleteButton";
import {RowEditButton} from "../../../../../util/components/RowEditButton";
import appStateSlice from "../../../../redux/slices/AppStateSlice";

export const GuestServiceOrdersPane = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rows, setRows] = useState<GuestServiceOrder[]>([]);
    const [openAddOrderDialog, setOpenAddOrderDialog] = useState<boolean>(false);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

    const columns = useRef([
        {field: 'orderId', headerName: 'Order ID', width: 150},
        {field: 'reservationId', headerName: 'Reservation ID', width: 150},
        {field: 'serviceId', headerName: 'Service ID', width: 150},
        {field: 'orderTime', headerName: 'Order Time', width: 150, valueFormatter: dateValueFormatter(appState.timeZone)},
        {field: 'orderStatus', headerName: 'Order Status', width: 150},
        {field: 'orderPrice', headerName: 'Order Price', width: 150},
        {field: 'orderQuantity', headerName: 'Order Quantity', width: 150},
        {field: 'orderDescription', headerName: 'Order Description', width: 150},
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
                        idField="orderId"
                        deleteFunction={handleDeleteOrder}
                    />
                </>
            ),
        },
    ] as GridColDef[])

    const handleDeleteOrder = (orderId: number) => {
        if (!window.confirm("Are you sure you want to delete this order?")) {
            return;
        }

        makeApiRequest(
            deleteGuestServiceOrder(orderId),
            dispatch,
            () => {
                refreshGuestServiceOrders();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Guest order deleted successfully!",
                        severity: "success",
                    })
                );
            }
        )
    }

    const refreshGuestServiceOrders = () => {
        setIsLoading(true)
        makeApiRequest<GuestServiceOrder[]>(
            getGuestServiceOrders(),
            dispatch,
            (data) => {
                setRows(data);
                setIsLoading(false);
            }
        )
    }

    useEffect(() => {
        refreshGuestServiceOrders();
    }, []);

    return (
        <>
            <AddGuestServiceOrderDialog open={openAddOrderDialog} setOpen={setOpenAddOrderDialog}
                                        refreshGuestServiceOrders={refreshGuestServiceOrders}/>
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
                        return row.orderId;
                    }}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
                <SpeedDial
                    ariaLabel='SpeedDial basic example'
                    sx={{position: 'fixed', bottom: 16, right: 16}}
                    onClick={() => setOpenAddOrderDialog(true)}
                    icon={<AddIcon/>}
                ></SpeedDial>
            </Paper>
        </>
    )
}