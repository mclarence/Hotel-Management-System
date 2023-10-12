import {Dialog, DialogContent, SpeedDial} from "@mui/material";
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

export const PaymentMethodsDialog = (props: {
    open: boolean,
    setOpen: (open: boolean) => void,
    guest: Guest | null
}) => {
    const dispatch = useAppDispatch();
    const [openAddPaymentMethodDialog, setOpenAddPaymentMethodDialog] = useState<boolean>(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [tableLoading, setTableLoading] = useState(false);

    // This is a hack to force the table to refresh when a payment method is deleted.
    // For some reason the getPaymentMethods() function is not working when called from the delete function.
    const [test, setTest] = useState(false);

    useEffect(() => {
        getPaymentMethods();
    }, [props.guest, props.open, test]);

    const getPaymentMethods = () => {
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

    const handleDeletePaymentMethod = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this payment method?")) {
            return;
        }

        makeApiRequest<null>(
            deletePaymentMethod(id),
            dispatch,
            () => {
                dispatch(appStateSlice.actions.setSnackBarAlert({
                    show: true,
                    message: "Payment method deleted successfully",
                    severity: "success"
                }))
                setTest(!test)

            }
        )
    }

    const columns = useRef([
        {field: "paymentMethodId", headerName: "ID", width: 100},
        {field: "type", headerName: "Type", width: 200},
        {field: "cardNumber", headerName: "Card Number", width: 200},
        {field: "cardCvv", headerName: "Card CVV", width: 200},
        {field: "cardExpiration", headerName: "Card Expiration Date", width: 200},
        {field: "cardHolderName", headerName: "Card Holder Name", width: 200},
        {field: "bankAccountNumber", headerName: "Bank Account Number", width: 200},
        {field: "bankBsb", headerName: "BSB", width: 200},
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <>
                    <RowDeleteButton
                        params={params}
                        idField="paymentMethodId"
                        deleteFunction={handleDeletePaymentMethod}
                    />
                </>
            ),
        },
    ])

    return (
        <>
            <AddPaymentMethodDialog
                open={openAddPaymentMethodDialog}
                setOpen={setOpenAddPaymentMethodDialog}
                guest={props.guest}
                fetchPaymentMethods={getPaymentMethods}
            />
            <Dialog open={props.open} fullWidth fullScreen>
                <DialogHeader title={`Viewing payment methods for: ${props.guest?.firstName} ${props.guest?.lastName}`}
                              onClose={() => props.setOpen(false)}/>
                <DialogContent sx={{padding: 2}}>
                    <DataGrid columns={columns.current}
                              rows={paymentMethods}
                              loading={tableLoading}
                              getRowId={(row) => row.paymentMethodId!}
                    />
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