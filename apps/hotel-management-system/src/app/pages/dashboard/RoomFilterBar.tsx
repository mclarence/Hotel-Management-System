// RoomFilterBar.js
import React from 'react';
import { FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';

interface RoomFilterBarProps {
    filterStatus: string;
    setFilterStatus: (filterStatus: string) => void;
    filterRoomType: string;
    setFilterRoomType: (filterRoomType: string) => void;
    searchRoomNumber: string;
    setSearchRoomNumber: (searchRoomNumber: string) => void;
}

function RoomFilterBar({ filterStatus, setFilterStatus, filterRoomType, setFilterRoomType, searchRoomNumber, setSearchRoomNumber }: RoomFilterBarProps) {
    return (
        <Paper>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Occupied">Occupied</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Room Type</InputLabel>
                <Select value={filterRoomType} onChange={(e) => setFilterRoomType(e.target.value)} >
                    <MenuItem value="">Filter by Room Type</MenuItem>
                    <MenuItem value="Single Bed">Single Bed</MenuItem>
                    <MenuItem value="Double Bed">Double Bed</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Room Number"
                value={searchRoomNumber}
                onChange={(e) => setSearchRoomNumber(e.target.value)}
                variant='filled'
                sx={{ m: 1, minWidth: 120 }}
            />
        </Paper>
    );
}

export default RoomFilterBar;
