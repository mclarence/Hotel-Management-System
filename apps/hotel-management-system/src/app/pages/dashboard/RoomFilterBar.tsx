// RoomFilterBar.js
import React from 'react';
import { FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import {RoomStatuses} from "@hotel-management-system/models";

interface RoomFilterBarProps {
    filterStatus: string;
    setFilterStatus: (filterStatus: string) => void;
    searchRoomNumber: string;
    setSearchRoomNumber: (searchRoomNumber: string) => void;
}

function RoomFilterBar({ filterStatus, setFilterStatus, searchRoomNumber, setSearchRoomNumber }: RoomFilterBarProps) {
    return (
        <Paper>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    {
                        Object.values(RoomStatuses).map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <TextField
                label="Room Code"
                value={searchRoomNumber}
                onChange={(e) => setSearchRoomNumber(e.target.value)}
                variant='filled'
                sx={{ m: 1, minWidth: 120 }}
            />
        </Paper>
    );
}

export default RoomFilterBar;
