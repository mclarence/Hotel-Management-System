import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import appStateSlice from "../../redux/slices/AppStateSlice";

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
  TableRow } from '@mui/material';

export const Rooms = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Room Management'));
    }, []);

    return (
      <Grid container spacing={1} columns={12}>
        <Grid item xs={1}>
          <Button variant="contained" style={{ minWidth: '100px', maxHeight: '55px', minHeight: '55px'}}>Add</Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" disabled style={{ minWidth: '100px', maxHeight: '55px', minHeight: '55px'}}>Edit</Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" disabled style={{ minWidth: '100px', maxHeight: '55px', minHeight: '55px'}}>Remove</Button>
        </Grid>
        <Grid item xs={9} sx={{textAlign: 'right'}}>
            <TextField
              id="outlined-basic"
              label="Search"
              type="search"
              variant="outlined"
            /> 
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Room ID</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Price Per Night</TableCell>
                  <TableCell align="right">Beds</TableCell>
                  <TableCell align="right">Bathrooms</TableCell>
                  <TableCell align="right">View</TableCell>
                  <TableCell align="right">Balcony</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              </TableBody>
            </Table>
          </TableContainer> 
        </Grid>
      </Grid>

    );
  };