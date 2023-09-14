import React from 'react';
import './Room.css';
import { Paper, Typography, Stack } from '@mui/material';

interface RoomProps {
    roomNumber: string;
    occupantName: string;
    roomInfo: string;
    roomStatus: string;
}

function Room({ roomNumber, occupantName, roomInfo, roomStatus }: RoomProps) {
    let roomColor;
    let centerDisplay;

    switch (roomStatus) {
        case 'Available':
            roomColor = 'green';
            centerDisplay = occupantName || 'Available';
            break;
        case 'Occupied':
            roomColor = '#36A2EB';
            centerDisplay = occupantName || 'Occupied';
            break;
        case 'Under Maintenance':
            roomColor = '#FFD700';
            centerDisplay = occupantName || 'Under Maintenance';
            break;
        default:
            roomColor = 'gray';
            centerDisplay = occupantName || 'unknown state';
    }

    return (
        <Paper className="room" style={{ backgroundColor: roomColor }} elevation={3}>
            <Stack width={'100%'}>
                <Typography variant='h6'>
                    {roomNumber}
                </Typography>
                <Typography variant='subtitle1' noWrap={true}>
                    {centerDisplay}
                </Typography>
                <Typography variant="caption">
                    {roomInfo}
                </Typography>
            </Stack>
        </Paper>
    );
}

export default Room;
