import React, {useEffect, useState} from 'react';
import './Room.css';
import {Paper, Stack, Typography} from '@mui/material';
import {RoomStatuses} from "@hotel-management-system/models";

interface RoomProps {
    roomNumber: string;
    occupantName: string;
    roomInfo: string;
    roomStatus: RoomStatuses;
}

function RoomCard({roomNumber, occupantName, roomInfo, roomStatus}: RoomProps) {
    const [roomColor, setRoomColor] = useState('gray');
    const [centerDisplay, setCenterDisplay] = useState('unknown state');

    useEffect(() => {
        switch (roomStatus) {
            case RoomStatuses.AVAILABLE:
                setRoomColor('green')
                setCenterDisplay(occupantName || 'Available')
                break;
            case RoomStatuses.OCCUPIED:
                setRoomColor('#36A2EB)')
                setCenterDisplay(occupantName || 'Occupied');
                break;
            case RoomStatuses.OUT_OF_SERVICE:
                setRoomColor('#FFD700')
                setCenterDisplay(occupantName || 'Under Maintenance');
                break;
            case RoomStatuses.UNAVAILABLE:
                setRoomColor('red')
                setCenterDisplay(occupantName || 'Unavailable');
                break;
            default:
                setRoomColor('gray')
                setCenterDisplay(occupantName || 'unknown state');
        }
    }, [roomStatus]);


    return (
        <Paper className="room" style={{backgroundColor: roomColor}} elevation={3}>
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

export default RoomCard;
