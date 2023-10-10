import React, {useEffect, useRef, useState} from "react";
import {Paper, SpeedDial} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
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

export const TransactionsPage = () => {

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openAddTransactionDialog, setOpenAddTransactionDialog] = useState(false);
    const dispatch = useAppDispatch();

    const fetchTransactions = () => {
        makeApiRequest<Transaction[]>(
            getTransactions(),
            dispatch,
            (data) => {
                setTransactions(data);
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
        {field: 'transactionId', headerName: 'Transaction ID', width: 200},
        {
            field: 'payementMethodId', headerName: 'Payment Method', width: 200, renderCell: (params: any) => {
                return params.row.paymentMethodType
            }
        },
        {
            field: 'guestId', headerName: 'Guest', width: 200, renderCell: (params: any) => {
                return params.row.guestFirstName + " " + params.row.guestLastName
            }
        },
        {field: 'amount', headerName: 'Amount', width: 200},
        {field: 'description', headerName: 'Description', width: 200},
        {field: 'date', headerName: 'Date', width: 200},
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            hideable: false,
            disableReorder: true,
            disableColumnMenu: true,
            renderCell: (params: any) => (
                <>
                    <RowDeleteButton params={params} deleteFunction={handleDeleteSingleTransaction}
                                     idField="transactionId"/>
                    {/*<RowEditButton onClick={() => handleEditClick(params.row)}/>*/}
                </>
            )
        },
    ])

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