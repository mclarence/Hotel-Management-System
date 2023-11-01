import React, {useEffect, useRef, useState} from "react";
import {Paper} from '@mui/material';
import {DataGrid} from "@mui/x-data-grid";
import {getLogs} from "../../api/resources/logs";
import {ApiResponse, Logs} from "@hotel-management-system/models";
import appStateSlice from "../../redux/slices/AppStateSlice";
import {useAppDispatch} from "../../redux/hooks";
import {CustomNoRowsOverlay} from "../../../util/components/CustomNoRowsOverlay";
import {makeApiRequest} from "../../api/makeApiRequest";

const LogsComponent = () => {
    // State to store logs data
    const [logs, setLogs] = useState<Logs[]>([]);
    // Redux dispatch hook
    const dispatch = useAppDispatch();
    // State to track loading status
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch logs data on component mount
        makeApiRequest<Logs[]>(
            getLogs(),
            dispatch,
            (data) => {
                setLogs(data);
            }
        )

    }, []) // Empty dependency array ensures this effect runs only once when the component mounts

// Define column structure for DataGrid
    const columns = useRef([
        {field: 'logId', headerName: 'Log ID', flex: 1},
        {field: 'eventType', headerName: 'Event Type', flex: 1},
        {field: 'timestamp', headerName: 'Timestamp', flex: 1},
        {field: 'userId', headerName: 'User', flex: 1},
        {field: 'description', headerName: 'Description', flex: 1},
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
