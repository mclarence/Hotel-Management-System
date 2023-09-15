import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import appStateSlice from '../../redux/slices/AppStateSlice';

import {
  Button,
  Grid,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface ITableData {
  roomID: number;
  status: string;
  pricePerNight: number;
  beds: number;
  bathrooms: number;
  view: string;
  balcony: string;
}

const initTableData: ITableData[] = [
  {
    roomID: 1001,
    status: 'Available',
    pricePerNight: 100,
    beds: 2,
    bathrooms: 1,
    view: 'Sea',
    balcony: 'Yes',
  },
  {
    roomID: 1002,
    status: 'Available',
    pricePerNight: 100,
    beds: 2,
    bathrooms: 1,
    view: 'Sea',
    balcony: 'Yes',
  },
  {
    roomID: 1003,
    status: 'Available',
    pricePerNight: 100,
    beds: 2,
    bathrooms: 1,
    view: 'Sea',
    balcony: 'Yes',
  },
  {
    roomID: 1004,
    status: 'Available',
    pricePerNight: 100,
    beds: 2,
    bathrooms: 1,
    view: 'Sea',
    balcony: 'Yes',
  },
  {
    roomID: 1005,
    status: 'Available',
    pricePerNight: 100,
    beds: 2,
    bathrooms: 1,
    view: 'Sea',
    balcony: 'Yes',
  },
  {
    roomID: 1006,
    status: 'Available',
    pricePerNight: 100,
    beds: 2,
    bathrooms: 1,
    view: 'Sea',
    balcony: 'Yes',
  },
];

export const Rooms = () => {
  const [tableData, setTableData] = useState<ITableData[]>(initTableData);
  const [selectRoom, setSelectRoom] = useState<ITableData>();
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const HandleEditRoom = (room: ITableData) => {
    setSelectRoom(room);
    setIsOpenDrawer(true);
  };

  const handleChangeRoom = (key: string, value: string) => {
    const newTableData = [...tableData];
    const RoomSelect: any = newTableData.find((item) => item.roomID === selectRoom?.roomID);
    RoomSelect[key] = value;
    newTableData.map((item) => {
      if (item.roomID === selectRoom?.roomID) {
        item = RoomSelect;
      }
    });
    setTableData(newTableData);
  };

  useEffect(() => {
    dispatch(appStateSlice.actions.setAppBarTitle('Room Management'));
  }, []);

  return (
    <Grid container spacing={1} columns={12}>
      <Grid item xs={1}>
        <Button variant='contained' style={{ minWidth: '100px', maxHeight: '55px', minHeight: '55px' }}>
          Add
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant='contained' disabled style={{ minWidth: '100px', maxHeight: '55px', minHeight: '55px' }}>
          Edit
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant='contained' disabled style={{ minWidth: '100px', maxHeight: '55px', minHeight: '55px' }}>
          Remove
        </Button>
      </Grid>
      <Grid item xs={9} sx={{ textAlign: 'right' }}>
        <TextField id='outlined-basic' label='Search' type='search' variant='outlined' />
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table size='small' aria-label='a dense table'>
            <TableHead>
              <TableRow>
                <TableCell>Room ID</TableCell>
                <TableCell align='center'>Status</TableCell>
                <TableCell align='center'>Price Per Night</TableCell>
                <TableCell align='center'>Beds</TableCell>
                <TableCell align='center'>Bathrooms</TableCell>
                <TableCell align='center'>View</TableCell>
                <TableCell align='center'>Balcony</TableCell>
                <TableCell align='center'>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.roomID}>
                  <TableCell component='th' scope='row'>
                    {row.roomID}
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    {row.status}
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    {row.pricePerNight}$
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    {row.beds}
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    {row.bathrooms}
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    {row.view}
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    {row.balcony}
                  </TableCell>
                  <TableCell component='th' scope='row' align='center'>
                    <Button onClick={() => HandleEditRoom(row)} size='small' variant='contained'>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Drawer anchor='right' open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
          <Box style={{ width: '800px' }} mt={10} p={3}>
            <Typography fontSize={22}>Information Room {selectRoom?.roomID}</Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <Box>
                  <InputLabel id='Status'>Status:</InputLabel>
                  <Select
                    labelId='Status'
                    value={selectRoom?.status}
                    style={{ width: '100%' }}
                    onChange={(event) => handleChangeRoom('status', event.target.value)}
                  >
                    <MenuItem value='Available'>Available</MenuItem>
                    <MenuItem value='Not Available'>Not Available</MenuItem>
                  </Select>
                </Box>
                <Box mt={1}>
                  <InputLabel id='Price Per Night'>Price Per Night:</InputLabel>
                  <TextField
                    value={selectRoom?.pricePerNight}
                    type='number'
                    style={{ width: '100%' }}
                    onChange={(event) => handleChangeRoom('pricePerNight', event.target.value)}
                  />
                </Box>
                <Box mt={1}>
                  <InputLabel id='Beds'>Beds:</InputLabel>
                  <TextField
                    value={selectRoom?.beds}
                    type='number'
                    style={{ width: '100%' }}
                    onChange={(event) => handleChangeRoom('beds', event.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <InputLabel id='View'>View:</InputLabel>
                  <TextField
                    value={selectRoom?.view}
                    type='text'
                    style={{ width: '100%' }}
                    onChange={(event) => handleChangeRoom('view', event.target.value)}
                  />
                </Box>
                <Box mt={1}>
                  <InputLabel id='Balcony'>Balcony:</InputLabel>
                  <Select
                    labelId='Balcony'
                    value={selectRoom?.balcony}
                    style={{ width: '100%' }}
                    onChange={(event) => handleChangeRoom('balcony', event.target.value)}
                  >
                    <MenuItem value='Yes'>Yes</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                  </Select>
                </Box>
                <Box mt={1}>
                  <InputLabel id='Bathrooms'>Bathrooms:</InputLabel>
                  <TextField
                    value={selectRoom?.bathrooms}
                    type='number'
                    style={{ width: '100%' }}
                    onChange={(event) => handleChangeRoom('bathrooms', event.target.value)}
                  />
                </Box>
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
      </Grid>
    </Grid>
  );
};