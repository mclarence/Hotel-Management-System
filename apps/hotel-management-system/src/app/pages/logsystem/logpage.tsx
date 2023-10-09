import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { addLog, deleteLog, getLogs } from "../../api/logs";
import { getCurrentUser } from '../../api/users';

export type Logs = {
    logId: number;
    operationType: string;
    timestamp: Date;
    operatedBy: string;
    guestName?: string;
    additionalInfo?: string;
};

const LogsComponent = () => {
    const [selectedLog, setSelectedLog] = useState<Logs | null>(null);
    const [logs, setLogs] = useState<Logs[]>([]);
    const [isFetchingLogs, setIsFetchingLogs] = useState<boolean>(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isOpenAddLogDialog, setIsOpenAddLogDialog] = useState(false);
    const [newLog, setNewLog] = useState<Partial<Logs>>({
        operationType: "Log adjustment"  // 
    });
    const [currentUserName, setCurrentUserName] = useState<string | null>(null);

    useEffect(() => {
        getLogs()
            .then((response) => response.json())
            .then((data) => {
                setLogs(data.data);
                setIsFetchingLogs(false);
            });
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            const name = await getCurrentUserName();
            setCurrentUserName(name);
        };
    
        fetchUserName();
    }, []);
    
    const getCurrentUserName = async () => {
        try {
            const response = await getCurrentUser();
            const data = await response.json();
            
            // ***The data structure returned based on the actual API，Get user name***
            return data.userName || "DefaultUserName";
        } catch (error) {
            console.error("Failed to get current user name:", error);
            return "DefaultUserName";
        }
    };

    const handleAddLog = (log: Logs) => {
        addLog(log)
            .then((response) => response.json())
            .then((data) => {
                setLogs(prevLogs => [...prevLogs, data.data]);
            });
    };

    const handleDeleteLog = (logId: number) => {
        deleteLog(logId).then(() => {
            setLogs(prevLogs => prevLogs.filter(log => log.logId !== logId));
        });
    };

    const handleAddLogDialogOpen = () => {
        setIsOpenAddLogDialog(true);
    };

    const handleAddLogDialogClose = () => {
        setIsOpenAddLogDialog(false);
    };
    const handleSubmitLog = async () => {
        if (newLog) {
            const currentTimestamp = new Date();
            const currentUserName = await getCurrentUserName();
    
            const logWithTimestampAndUser = {
                ...newLog,
                timestamp: currentTimestamp,
                operatedBy: currentUserName
            }
    
            handleAddLog(logWithTimestampAndUser as Logs);
            setNewLog({
                operationType: "Log adjustment"
            });
            handleAddLogDialogClose();
        }
    };
    

    const columns: GridColDef[] = [
        { field: 'logId', headerName: 'Log ID', width: 130 },
        { field: 'operationType', headerName: 'Operation Type', width: 180 },
        { field: 'timestamp', headerName: 'Timestamp', width: 250 },
        { field: 'operatedBy', headerName: 'Operated By', width: 180 },
        { field: 'additionalInfo', headerName: 'Additional Info', width: 250 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Button variant="outlined" onClick={() => {
                        setSelectedLog(params.row as Logs);
                        setIsOpenDrawer(true);
                    }}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteLog((params.row as Logs).logId)}>
                        Delete
                    </Button>
                </>
            )
        },
    ];

    return (
        <>
            <Stack direction={'column'} gap={2}>
                <Button variant="contained" color="primary" onClick={handleAddLogDialogOpen}>
                    Add Log
                </Button>
                <DataGrid
                    disableRowSelectionOnClick={true}
                    rows={logs}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => (row as Logs).logId}
                    checkboxSelection
                />
            </Stack>

            <Dialog open={isOpenAddLogDialog} onClose={handleAddLogDialogClose}>
                <DialogTitle>Add a New Log</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Operation Type"
                                fullWidth
                                value={newLog.operationType || ""}
                                InputProps={{
                                    readOnly: true,  
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Operated By"
                                fullWidth
                                value={newLog.operatedBy || getCurrentUserName()}
                                InputProps={{
                                    readOnly: true,  
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Additional Info"
                                fullWidth
                                value={newLog.additionalInfo || ""}
                                onChange={(e) => setNewLog(prev => ({ ...prev, additionalInfo: e.target.value }))}
                            />
                        </Grid>
                    </Grid>
                    <Button onClick={handleSubmitLog} variant="contained" color="primary" style={{ float: 'right', marginTop: 30 }}>
                        Submit
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LogsComponent;
