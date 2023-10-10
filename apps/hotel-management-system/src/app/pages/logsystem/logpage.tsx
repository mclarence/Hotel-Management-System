import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { addLog, deleteLog, getLogs } from "../../api/logs";
import { getCurrentUser } from '../../api/users';
import { useAppDispatch } from "../../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Logs } from "@hotel-management-system/models";


const LogsComponent = () => {
    const [selectedLog, setSelectedLog] = useState<Logs | null>(null);
    const [logs, setLogs] = useState<Logs[]>([]);
    const [isFetchingLogs, setIsFetchingLogs] = useState<boolean>(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isOpenAddLogDialog, setIsOpenAddLogDialog] = useState(false);
    const [operationType, setOperationType] = useState("Adjustment log");//The default value for this page
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [currentUserName, setCurrentUserName] = useState<string | null>(null);
    const appState = useSelector((state: RootState) => state.appState);
    const dispatch = useAppDispatch();

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
        if (operationType !== "" && additionalInfo !== "") {
            const currentTimestamp = new Date();
    
            const logWithTimestampAndUser: Logs = {
                timestamp: currentTimestamp,
                operatedBy: appState.currentlyLoggedInUser?.userId!,
                operationType: operationType,
                additionalInfo: additionalInfo
            }
    
            handleAddLog(logWithTimestampAndUser as Logs)
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
                    <Button variant="outlined" color="error" onClick={() => handleDeleteLog((params.row as Logs).logId!)
}>
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
                    density="compact"
                    disableRowSelectionOnClick={true}
                    checkboxSelection={false}
                    rows={logs}
                    columns={columns}
                    loading={isFetchingLogs}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => (row as Logs).logId!}//There is a problem with this line of code
                    autoHeight={true}
                    sx={{ height: '100%' }}
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
                                value={operationType}
                                InputProps={{
                                    readOnly: true,  
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Additional Info"
                                fullWidth
                                value={additionalInfo}
                                onChange={(e) => {
                                    setAdditionalInfo(e.target.value)
                                }}
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
