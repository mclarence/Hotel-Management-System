import {useEffect, useState} from 'react';
import {useAppDispatch} from '../../redux/hooks';
import appStateSlice from '../../redux/slices/AppStateSlice';

import {
    Box,
    Button,
    Drawer,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {PriceUnits, Room, RoomStatuses} from "@hotel-management-system/models";
import {verifyLogin} from "../../api/auth";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";


const rows: Room[] = [
    {
        roomId: 1001,
        status: RoomStatuses.Available,
        price: 100,
        priceUnit: PriceUnits.night,
        metadata: {
            'beds': 2,
            'bathrooms': 1,
            'x': 'test',
            'y': 'test1',
            'z': 'test2',
        },
    },
    {
        roomId: 1002,
        status: RoomStatuses.Available,
        price: 100,
        priceUnit: PriceUnits.night,
        metadata: {
            'beds': 2,
            'bathrooms': 1
        },
    },
    {
        roomId: 1003,
        status: RoomStatuses.Available,
        price: 100,
        priceUnit: PriceUnits.night,
        metadata: {
            'beds': 2,
            'bathrooms': 1
        },
    },
    {
        roomId: 1004,
        status: RoomStatuses.Available,
        price: 100,
        priceUnit: PriceUnits.night,
        metadata: {
            'beds': 2,
            'bathrooms': 1
        },
    },
    {
        roomId: 1005,
        status: RoomStatuses.Available,
        price: 100,
        priceUnit: PriceUnits.night,
        metadata: {
            'beds': 2,
            'bathrooms': 1
        },
    },
    {
        roomId: 1006,
        status: RoomStatuses.Available,
        price: 100,
        priceUnit: PriceUnits.night,
        metadata: {
            'beds': 2,
            'bathrooms': 1
        },
    },
];
export const Rooms = () => {
    const [selectRoom, setSelectRoom] = useState<Room>();
    const [tableData, setTableData] = useState<Room[]>(rows);
    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const appState = useSelector((state: RootState) => state.appState);

    useEffect(() => {
        if (!appState.loggedIn) {
            navigate('/login')
        }
    }, [appState.loggedIn]);

    //
    const HandleEditRoom = (room: Room) => {
        console.log(room.metadata)
        setSelectRoom(room);
        setIsOpenDrawer(true);
    };

    const handleChangeRoom = (key: string, value: string) => {
        const newTableData = [...tableData];
        const RoomSelect: any = newTableData.find((item) => item.roomId === selectRoom?.roomId);
        RoomSelect[key] = value;
        newTableData.map((item) => {
            if (item.roomId === selectRoom?.roomId) {
                item = RoomSelect;
            }
        });
        setTableData(newTableData);
    };

    const columns: GridColDef[] = [
        {field: 'roomId', headerName: 'Room ID', width: 130},
        {field: 'status', headerName: 'Status', width: 130},
        {field: 'price', headerName: 'Unit Price', width: 130},
        {field: 'priceUnit', headerName: 'Price Unit', width: 130},
        {
            field: 'actions', headerName: 'Actions', width: 150, renderCell: (params: any) => (
                <strong>
                    <Button variant="outlined" onClick={() => HandleEditRoom(params.row)}>
                        Edit
                    </Button>
                </strong>
            )
        },
    ]

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Room Management'));
        dispatch(appStateSlice.actions.setLastPageVisited('/rooms'));
    }, []);

    return (
        <>
            <Stack direction={'column'} gap={2}>
                <Stack direction={'row'} gap={2}>
                    <Button variant="contained" color="success">
                        Add Room
                    </Button>
                    <Button variant="contained" color="info">
                        Edit Room
                    </Button>
                    <Button variant="contained" color="error">
                        Delete Room
                    </Button>
                </Stack>
                <DataGrid
                    disableRowSelectionOnClick={true}
                    rows={tableData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    getRowId={(row) => row.roomId}
                    checkboxSelection
                />
            </Stack>
            <Drawer anchor='right' open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
                <Box style={{width: '800px'}} mt={10} p={3}>
                    <Typography fontSize={22}>Room: {selectRoom?.roomId.toString()}</Typography>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={6}>
                            <Box>
                                <InputLabel id='Status'>Status:</InputLabel>
                                <Select
                                    labelId='Status'
                                    value={selectRoom?.status}
                                    style={{width: '100%'}}
                                    onChange={(event) => handleChangeRoom('status', event.target.value.toString())}
                                >
                                    <MenuItem value='Available'>Available</MenuItem>
                                    <MenuItem value='Not Available'>Not Available</MenuItem>
                                </Select>
                            </Box>
                            <Box mt={1}>
                                <InputLabel id='Price Per Night'>Price:</InputLabel>
                                <TextField
                                    value={selectRoom?.price}
                                    type='number'
                                    style={{width: '100%'}}
                                    onChange={(event) => handleChangeRoom('price', event.target.value)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mt={0}>
                                <InputLabel id='Price Per Night'>Unit:</InputLabel>
                                <TextField
                                    value={selectRoom?.priceUnit}
                                    type='text'
                                    style={{width: '100%'}}
                                    onChange={(event) => handleChangeRoom('priceUnit', event.target.value)}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box>
                        <Typography fontSize={22} mt={2}>Metadata</Typography>
                        <Stack direction={"row"}>
                            <Button>Add</Button>
                            <Button>Delete</Button>
                        </Stack>
                        <TableContainer component={Paper}>
                            <Table size={'small'}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Property</TableCell>
                                        <TableCell>Value</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectRoom && selectRoom.metadata && Object.keys(selectRoom.metadata).map((key) => (
                                        <TableRow key={key}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell>{String(selectRoom?.metadata[key])}</TableCell>
                                            <TableCell><Button size={"small"}>Edit</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Button
                        onClick={() => setIsOpenDrawer(false)}
                        variant='contained'
                        color='error'
                        style={{float: 'right', marginTop: 30}}
                    >
                        Close
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};