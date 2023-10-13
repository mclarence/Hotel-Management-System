import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogContent, Paper, SpeedDial, Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { CustomNoRowsOverlay } from '../../../util/components/CustomNoRowsOverlay';
import dayjs from 'dayjs';
import { DialogHeader } from '../../../util/components/DialogHeader';

const rows = [
  { id: 1, name: 'Jon', order: 'service', time_ordered: Date.now(), status: 'pending' },
  { id: 2, name: 'Cersei', order: 'service', time_ordered: Date.now(), status: 'pending' },
  { id: 3, name: 'Jaime', order: 'service', time_ordered: Date.now(), status: 'pending' },
];

export default function AdditionalServices() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Guest ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
    },
    {
      field: 'order',
      headerName: 'Order',
      width: 150,
    },
    {
      field: 'time_ordered',
      headerName: 'Time Order',
      width: 150,
      valueFormatter: (params) => {
        return dayjs(params.value).format('HH:mm MM/DD/YYYY');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
    },
  ];

  return (
    <Paper sx={{ padding: 2 }}>
      <Dialog open={open} fullWidth>
        <DialogHeader title={'Create Additional Services'} onClose={() => setOpen(false)} />
        <DialogContent>
          <Stack gap={2}>
            <Typography variant={'body1'}>Enter additional services details below.</Typography>
            <Typography variant={'subtitle2'}>Additional Services Details</Typography>
          </Stack>
          <Stack sx={{ py: 2 }} spacing={2}>
            <TextField label='Name' variant='outlined' />
            <TextField label='Order' variant='outlined' />
            <TextField label='Time Order' variant='outlined' />
            <TextField label='Status' variant='outlined' />
          </Stack>
        </DialogContent>
      </Dialog>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          density={'compact'}
          disableRowSelectionOnClick={true}
          checkboxSelection={false}
          rows={rows}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10]}
          autoHeight={true}
          sx={{ height: '100%' }}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
        />
      </Box>
      <SpeedDial
        ariaLabel='SpeedDial basic example'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpen(true)}
        icon={<AddIcon />}
      ></SpeedDial>
    </Paper>
  );
}
