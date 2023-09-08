import React, { useState } from 'react';
import './HotelDashboard.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Room from './Room';
import rooms from './roomData';
import RoomFilterBar from './RoomFilterBar';

function HotelDashboard() {
    const occupancyRate = 78;
    const vacancyRate = 100 - occupancyRate;

    const data = [
        { name: 'OccupancyRate', value: occupancyRate },
        { name: 'VacancyRate', value: vacancyRate },
    ];

    const COLORS = ['#36A2EB', '#FFCE56'];

    // 筛选和搜索的状态
    const [filterStatus, setFilterStatus] = useState('');
    const [filterRoomType, setFilterRoomType] = useState('');
    const [searchRoomNumber, setSearchRoomNumber] = useState('');

    // 根据状态筛选rooms
    const filteredRooms = rooms.filter(room => {
        return (
            (filterStatus === '' || room.roomStatus === filterStatus) &&
            (filterRoomType === '' || room.roomInfo === filterRoomType) &&
            (searchRoomNumber === '' || room.roomNumber.includes(searchRoomNumber))
        );
    });

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Hotel management systems</h1>
            </header>
            <section className="dashboard-section">
            <div className="left-panel">
                    <RoomFilterBar 
                        filterStatus={filterStatus} 
                        setFilterStatus={setFilterStatus}
                        filterRoomType={filterRoomType}
                        setFilterRoomType={setFilterRoomType}
                        searchRoomNumber={searchRoomNumber}
                        setSearchRoomNumber={setSearchRoomNumber}
                    />
                    <div className="rooms-container">
                        {filteredRooms.map(room => (
                            <Room 
                                key={room.roomNumber}
                                roomNumber={room.roomNumber}
                                occupantName={room.occupantName}
                                roomInfo={room.roomInfo}
                                roomStatus={room.roomStatus}
                            />
                        ))}
                    </div>
                </div>
                <div className="right-panel">
                    <div className="card">
                        <h2>Occupancy rate</h2>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={data}
                                cx={200}
                                cy={150}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {
                                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)
                                }
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="card">
                        <h2>Check-in/check-out today</h2>
                        <p>Arrivals: 35</p>
                        <p>Departures: 28</p>
                    </div>
                    <div className="card">
                        <h2>Room status</h2>
                        <ul>
                            <li>Booked: 20</li>
                            <li>Checked in: 45</li>
                            <li>To be maintained: 15</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HotelDashboard;
