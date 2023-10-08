// import { useEffect, useState } from 'react';
// import { Box, Button, Drawer, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { Logs } from "@hotel-management-system/models";
// import { useAppDispatch, useAppSelector } from '../../redux/hooks'; // 
// import appStateSlice from '../../redux/slices/AppStateSlice';

// const dummyLogs: Logs[] = [
//     {
//         logId: 1,
//         type: "Check-in",
//         description: "User checked into Room 1001",
//         date: new Date(),
//         data: "Room 1001",
//         roomId: 1001
//     },
//     {
//         logId: 2,
//         type: "Check-out",
//         description: "User checked out from Room 1002",
//         date: new Date(),
//         data: "Room 1002",
//         roomId: 1002
//     }
//     // ... add more logs as required
// ];

// export const LogsComponent = () => {
//     const [selectedLog, setSelectedLog] = useState<Logs>();
//     const [tableData, setTableData] = useState<Logs[]>(dummyLogs);
//     const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
//     const dispatch = useAppDispatch();

//     const HandleEditLog = (log: Logs) => {
//         setSelectedLog(log);
//         setIsOpenDrawer(true);
//     };

//     const columns: GridColDef[] = [
//         { field: 'logId', headerName: 'Log ID', width: 130 },
//         { field: 'type', headerName: 'Type', width: 130 },
//         { field: 'description', headerName: 'Description', width: 250 },
//         { field: 'date', headerName: 'Date', width: 200 },
//         {
//             field: 'actions', headerName: 'Actions', width: 150, renderCell: (params: any) => (
//                 <strong>
//                     <Button variant="outlined" onClick={() => HandleEditLog(params.row)}>
//                         Edit
//                     </Button>
//                 </strong>
//             )
//         },
//     ]

//     useEffect(() => {
//         dispatch(appStateSlice.actions.setAppBarTitle('Logs Management'));
//     }, []);

//     return (
//         <>
//             <Stack direction={'column'} gap={2}>
//                 <DataGrid
//                     disableRowSelectionOnClick={true}
//                     rows={tableData}
//                     columns={columns}
//                     initialState={{
//                         pagination: {
//                             paginationModel: { page: 0, pageSize: 5 },
//                         },
//                     }}
//                     pageSizeOptions={[5, 10]}
//                     getRowId={(row) => row.logId}
//                     checkboxSelection
//                 />
//             </Stack>
//             <Drawer anchor='right' open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
//                 <Box style={{ width: '800px' }} mt={10} p={3}>
//                     <Typography fontSize={22}>Log ID: {selectedLog?.logId}</Typography>
//                     <Grid container spacing={2} mt={2}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Description"
//                                 fullWidth
//                                 value={selectedLog?.description}
//                                 onChange={(e) => setSelectedLog(prev => ({ ...prev!, description: e.target.value }))}
//                             />
//                         </Grid>
//                     </Grid>
//                     <Button
//                         onClick={() => setIsOpenDrawer(false)}
//                         variant='contained'
//                         color='error'
//                         style={{ float: 'right', marginTop: 30 }}
//                     >
//                         Close
//                     </Button>
//                 </Box>
//             </Drawer>
//         </>
//     );
// };
