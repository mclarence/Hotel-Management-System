import React, {useEffect, useState} from 'react';
import './Room.css';
import {Paper, Stack, Typography} from '@mui/material';
import {RoomStatuses} from "@hotel-management-system/models";

interface RoomProps {
    roomNumber: string;
    roomInfo: string;
    roomStatus: RoomStatuses;
}

function RoomCard({roomNumber, roomInfo, roomStatus}: RoomProps) {
    const [roomColor, setRoomColor] = useState('gray');
    const [centerDisplay, setCenterDisplay] = useState('unknown state');

    useEffect(() => {
        switch (roomStatus) {
            case RoomStatuses.AVAILABLE:
                setRoomColor('green')
                setCenterDisplay( 'Available')
                break;
            case RoomStatuses.OCCUPIED:
                setRoomColor('#36A2EB)')
                setCenterDisplay( 'Occupied');
                break;
            case RoomStatuses.OUT_OF_SERVICE:
                setRoomColor('#FFD700')
                setCenterDisplay( 'Under Maintenance');
                break;
            case RoomStatuses.UNAVAILABLE:
                setRoomColor('red')
                setCenterDisplay( 'Unavailable');
                break;
            case RoomStatuses.RESERVED:
                setRoomColor('#FF7F50')
                setCenterDisplay( 'Reserved');
                break;
            default:
                setRoomColor('gray')
                setCenterDisplay( '...');
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
