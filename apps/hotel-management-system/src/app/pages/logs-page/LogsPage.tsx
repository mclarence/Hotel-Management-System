import React, {useEffect, useRef, useState} from "react";
import {Paper} from '@mui/material';
import {DataGrid} from "@mui/x-data-grid";
import {getLogs} from "../../api/logs";
import {ApiResponse, Logs} from "@hotel-management-system/models";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../redux/hooks";
import {CustomNoRowsOverlay} from "../../../util/CustomNoRowsOverlay";

const LogsComponent = () => {
    const [logs, setLogs] = useState<Logs[]>([]);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getLogs()
            .then((response) => {
                return response.json();
            })
            .then((data: ApiResponse<Logs[]>) => {
                if (data.success) {
                    setLogs(data.data);
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
    }, [])


    const columns = useRef([
        {field: 'logId', headerName: 'Log ID', width: 130},
        {field: 'eventType', headerName: 'Event Type', width: 180},
        {field: 'timestamp', headerName: 'Timestamp', width: 250},
        {field: 'userId', headerName: 'User', width: 180},
        {field: 'description', headerName: 'Description', width: 250},
    ])

    return (
        <>
            <Paper sx={{padding: 2}}>
                <DataGrid
                    density={"compact"}
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={logs}
                    columns={columns.current}
                    loading={isLoading}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => {
                        return row.logId!;
                    }}
                    autoHeight={true}
                    sx={{height: "100%"}}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </Paper>
        </>
    );
};

export default LogsComponent;
