import {Dialog, DialogContent, Paper, SpeedDial} from "@mui/material";
import {DialogHeader} from "../../../../util/components/DialogHeader";
import {Guest, PaymentMethod} from "@hotel-management-system/models";
import {useEffect, useRef, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import AddCardIcon from '@mui/icons-material/AddCard';
import {AddPaymentMethodDialog} from "./AddPaymentMethodDialog";
import {deletePaymentMethod, getPaymentMethodsByGuestId} from "../../../api/resources/paymentMethods";
import appStateSlice from "../../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../../redux/hooks";
import {makeApiRequest} from "../../../api/makeApiRequest";
import {RowDeleteButton} from "../../../../util/components/RowDeleteButton";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import dayjs from "dayjs";

export const PaymentMethodsDialog = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
    guest: Guest | null
}) => {
    const dispatch = useAppDispatch();
    const [openAddPaymentMethodDialog, setOpenAddPaymentMethodDialog] = useState<boolean>(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const appState = useSelector((state: RootState) => state.appState);

    const [refresh, setRefresh] = useState(false);
    const getGuestPaymentMethods = () => {
        if (props.guest != null) {
            setTableLoading(true)
            makeApiRequest<PaymentMethod[]>(
                getPaymentMethodsByGuestId(props.guest.guestId!),
                dispatch,
                (data) => {
                    console.log(data)
                    setPaymentMethods(data);
                    setTableLoading(false);
                }
            )
        }
    }

    useEffect(() => {
        if (props.guest != null) {
            getGuestPaymentMethods();
        }

        if (!props.open) {
            setPaymentMethods([]);
        }
    }, [props.guest, props.open]);

    useEffect(() => {
            getGuestPaymentMethods();
    }, [refresh]);

    const handleDeletePaymentMethod = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this payment method?")) {
            return;
        } else {
            makeApiRequest<null>(
                deletePaymentMethod(id),
                dispatch,
                (data) => {
                    setRefresh(!refresh)
                    dispatch(appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Payment method deleted successfully",
                        severity: "success"
                    }))
                }
            )
        }
    }

    const notApplicableValueFormatter = (params: any) => {
        if (params.value) {
            return params.value
        } else {
            return "N/A"
        }
    }

    const columns = useRef([
        {field: "paymentMethodId", headerName: "ID", width: 100},
        {field: "type", headerName: "Type", width: 200},
        {
            field: "cardNumber", headerName: "Card Number", width: 200, valueFormatter: (params: any) => {
                if (params.value) {
                    return params.value.replace(/\d(?=\d{4})/g, "*")
                } else {
                    return "N/A"
                }
            }
        },
        {field: "cardCvv", headerName: "Card CVV", width: 200, valueFormatter: notApplicableValueFormatter},
        {
            field: "cardExpiration", headerName: "Card Expiration Date", width: 200, valueFormatter: (params: any) => {
                if (params.value) {
                    return dayjs.utc(params.value).format("MM/YYYY")
                } else {
                    return "N/A"
                }

            }
        },
        {field: "cardHolderName", headerName: "Card Holder Name", width: 200, valueFormatter: notApplicableValueFormatter},
        {field: "bankAccountNumber", headerName: "Bank Account Number", width: 200, valueFormatter: notApplicableValueFormatter},
        {field: "bankBsb", headerName: "BSB", width: 200, valueFormatter: notApplicableValueFormatter},
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <RowDeleteButton
                    params={params}
                    idField="paymentMethodId"
                    deleteFunction={handleDeletePaymentMethod}
                />
            ),
        },
    ])

    return (
        <>
            <AddPaymentMethodDialog
                open={openAddPaymentMethodDialog}
                setOpen={setOpenAddPaymentMethodDialog}
                guest={props.guest}
                fetchPaymentMethods={getGuestPaymentMethods}
            />
            <Dialog open={props.open} fullWidth fullScreen>
                <DialogHeader title={`Viewing payment methods for: ${props.guest?.firstName} ${props.guest?.lastName}`}
                              onClose={() => props.setOpen(false)}/>
                <DialogContent sx={{padding: 2}}>
                    <Paper sx={{height: '100%'}}>
                        <DataGrid columns={columns.current}
                                  rows={paymentMethods}
                                  loading={tableLoading}
                                  getRowId={(row) => row.paymentMethodId!}
                                  sx={{height: '100%'}}
                        />
                    </Paper>
                </DialogContent>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{position: "fixed", bottom: 90, right: 32}}
                    onClick={() => {
                        setOpenAddPaymentMethodDialog(true);
                    }}
                    icon={<AddCardIcon/>}
                ></SpeedDial>
            </Dialog>
        </>
    )
}