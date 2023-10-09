import React, { useEffect, useState } from "react";
import { Box, Button, Drawer, Grid, Typography, TextField, Stack } from '@mui/material';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Logs } from "@hotel-management-system/models";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import appStateSlice from '../../redux/slices/AppStateSlice';
import { fetchLogs } from "../../redux/slices/AppStateSlice";
import {getLogs} from "../../api/logs";

export const LogsComponent = () => {
    const [selectedLog, setSelectedLog] = useState<Logs | null>(null);
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const [logs , setLogs] = useState<Logs[]>([]);
    const [isFetchingLogs, setIsFetchingLogs] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        getLogs()
            .then((response) => response.json())
            .then((data) => {
                setLogs(data.data);
                setIsFetchingLogs(false);
            })
    }, []);

    const HandleEditLog = (log: Logs) => {
        setSelectedLog(log);
        setIsOpenDrawer(true);
    };

    const columns: GridColDef[] = [
        { field: 'log_id', headerName: 'Log ID', width: 130 },
        { field: 'operation_type', headerName: 'Operation Type', width: 180 },
        { field: 'timestamp', headerName: 'Timestamp', width: 250 },
        { field: 'operated_by', headerName: 'Operated By', width: 180 },
        {
            field: 'actions', headerName: 'Actions', width: 150, renderCell: (params: any) => (
                <Button variant="outlined" onClick={() => HandleEditLog(params.row)}>
                    Edit
                </Button>
            )
        },
    ]

    return (
        <>
            <Stack direction={'column'} gap={2}>
                <DataGrid
                    disableRowSelectionOnClick={true}
                    rows={logs}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    loading={isFetchingLogs}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => row.logId}
                    checkboxSelection
                />
            </Stack>
            {selectedLog && (
                <Drawer anchor='right' open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
                    <Box style={{ width: '800px' }} mt={10} p={3}>
                        <Typography fontSize={22}>Log ID: {selectedLog.logId}</Typography>
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Description"
                                    fullWidth
                                    value={selectedLog.additionalInfo}
                                    onChange={(e) => setSelectedLog(prev => ({ ...prev!, additionalInfo: e.target.value }))}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            onClick={() => setIsOpenDrawer(false)}
                            variant='contained'
                            color='error'
                            style={{ float: 'right', marginTop: 30 }}
                        >
                            Close
                        </Button>
                    </Box>
                </Drawer>
            )}
        </>
    );
};

export default LogsComponent;
