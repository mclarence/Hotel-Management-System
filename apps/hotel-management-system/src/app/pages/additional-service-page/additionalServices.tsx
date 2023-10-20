import AddIcon from '@mui/icons-material/Add';
import {Dialog, DialogContent, Paper, SpeedDial, Stack, Tab, Tabs, TextField, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import React, {useState} from 'react';
import {CustomNoRowsOverlay} from '../../../util/components/CustomNoRowsOverlay';
import dayjs from 'dayjs';
import {DialogHeader} from '../../../util/components/DialogHeader';
import {a11yProps, CustomTabPanel} from "../../../util/components/CustomTabPanel";
import {GuestServiceOrdersPane} from "./components/guestServiceOrders/guestServiceOrdersPane";
import {GuestServicesPane} from "./components/guestServices/guestServicesPane";

export default function AdditionalServices() {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Dialog open={open} fullWidth>
                <DialogHeader title={'Create Additional Services'} onClose={() => setOpen(false)}/>
                <DialogContent>
                    <Stack gap={2}>
                        <Typography component={'span'} variant={'body1'}>Enter additional services details below.</Typography>
                        <Typography component={'span'} variant={'subtitle2'}>Additional Services Details</Typography>
                    </Stack>
                    <Stack sx={{py: 2}} spacing={2}>
                        <TextField label='Name' variant='outlined'/>
                        <TextField label='Order' variant='outlined'/>
                        <TextField label='Time Order' variant='outlined'/>
                        <TextField label='Status' variant='outlined'/>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Orders" {...a11yProps(0)} />
                        <Tab label="Services" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                        <GuestServiceOrdersPane/>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                        <GuestServicesPane/>
                </CustomTabPanel>
            </Box>
        </>
    );
}
