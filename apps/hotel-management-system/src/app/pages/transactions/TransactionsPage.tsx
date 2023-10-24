import React, {useEffect, useRef, useState} from "react";
import {Paper, SpeedDial} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import AddIcon from "@mui/icons-material/Add";
import {ApiResponse, Transaction} from "@hotel-management-system/models";
import {deleteTransaction, getTransactions} from "../../api/resources/transactions";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../redux/hooks";
import {CreateTransactionDialog} from "./components/CreateTransactionDialog";
import {RowDeleteButton} from "../../../util/components/RowDeleteButton";
import {RowEditButton} from "../../../util/components/RowEditButton";
import {makeApiRequest} from "../../api/makeApiRequest";
import {dateValueFormatter} from "../../../util/dateValueFormatter";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

export const TransactionsPage = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openAddTransactionDialog, setOpenAddTransactionDialog] = useState(false);
    const dispatch = useAppDispatch();
    const appState = useSelector((state: RootState) => state.appState);

    const fetchTransactions = () => {
        setIsLoading(true)
        makeApiRequest<Transaction[]>(
            getTransactions(),
            dispatch,
            (data) => {
                setTransactions(data);
                setIsLoading(false)
            }
        )
    }
    const handleDeleteSingleTransaction = (id: number) => {
        makeApiRequest<null>(
            deleteTransaction(id),
            dispatch,
            (data) => {
                fetchTransactions();
                dispatch(
                    appStateSlice.actions.setSnackBarAlert({
                        show: true,
                        message: "Transaction deleted successfully",
                        severity: "success",
                    })
                );
            }
        )
    }

    const columns = useRef([
        {field: 'transactionId', headerName: 'Transaction ID', flex: 1},
        {
            field: 'payementMethodId', headerName: 'Payment Method', flex: 1, renderCell: (params: any) => {
                return params.row.paymentMethodType
            }
        },
        {
            field: 'guestId', headerName: 'Guest', flex: 1, renderCell: (params: any) => {
                return params.row.guestFirstName + " " + params.row.guestLastName
            }
        },
        {field: 'amount', headerName: 'Amount', flex: 1},
        {field: 'description', headerName: 'Description', flex: 1},
        {field: 'date', headerName: 'Date', flex: 1, valueFormatter: dateValueFormatter(appState.timeZone)},
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            hideable: false,
            flex: 1,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <>
                    <RowDeleteButton params={params} deleteFunction={handleDeleteSingleTransaction}
                                     idField="transactionId"/>
                </>
            )
        },
    ] as GridColDef[])

    useEffect(() => {
        fetchTransactions()
    }, []);

    return (
        <>
            <CreateTransactionDialog open={openAddTransactionDialog} setOpen={setOpenAddTransactionDialog}
                                     fetchTransactions={fetchTransactions}/>
            <Paper sx={{padding: 2}}>
                <DataGrid
                    density={"compact"}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={transactions}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => {
                        return row.transactionId!;
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
                    setOpenAddTransactionDialog(true);
                }}
                icon={<AddIcon/>}
            ></SpeedDial>
        </>
    )
}