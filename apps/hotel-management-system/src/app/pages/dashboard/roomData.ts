// roomData.js

interface Room {
    roomNumber: string;
    occupantName: string;
    roomInfo: string;
    roomStatus: string;
  }
const rooms: Room[] = [
    { roomNumber: '101', occupantName: 'Tom', roomInfo: 'Double Bed', roomStatus: 'Occupied' },
    { roomNumber: '102', occupantName: '', roomInfo: 'Single Bed', roomStatus: 'Available' },
    { roomNumber: '103', occupantName: 'Jack', roomInfo: 'Double Bed', roomStatus: 'Occupied' },
    { roomNumber: '104', occupantName: '',roomInfo: 'Single Bed', roomStatus: 'Under Maintenance' },
    { roomNumber: '105', occupantName: 'Tom', roomInfo: 'Double Bed', roomStatus: 'Occupied' },
    { roomNumber: '106', occupantName: '', roomInfo: 'Single Bed', roomStatus: 'Available' },
    { roomNumber: '107', occupantName: 'Ben', roomInfo: 'Double Bed', roomStatus: 'Occupied' },
    { roomNumber: '108', occupantName: '',roomInfo: 'Single Bed', roomStatus: 'Under Maintenance' },
    { roomNumber: '109', occupantName: 'Jesus', roomInfo: 'Double Bed', roomStatus: 'Occupied' },
    { roomNumber: '110', occupantName: '', roomInfo: 'Single Bed', roomStatus: 'Available' },
    { roomNumber: '111', occupantName: 'Satan', roomInfo: 'Double Bed', roomStatus: 'Occupied' },
    { roomNumber: '112', occupantName: '',roomInfo: 'Single Bed', roomStatus: 'Under Maintenance' },
  ];
  
  export default rooms;
  