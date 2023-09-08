import React from 'react';
import './Room.css';

function Room({ roomNumber, occupantName, roomInfo, roomStatus }) {
    let roomColor;
    let centerDisplay;

    switch(roomStatus) {
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
        <div className="room" style={{ backgroundColor: roomColor }}>
            <div className="room-number">{roomNumber}</div>
            <div className="center-content">{centerDisplay}</div>
            <div className="room-info">{roomInfo}</div>
        </div>
    );
}

export default Room;
