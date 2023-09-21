import React, { useEffect, useState } from 'react';
import './HotelDashboard.css';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Room from './Room';
import rooms from './roomData';
import RoomFilterBar from './RoomFilterBar';
import { Card, Paper, Stack, Typography } from '@mui/material';
import appStateSlice from '../../redux/slices/AppStateSlice';
import { useAppDispatch } from "../../redux/hooks";

export function Dashboard() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(appStateSlice.actions.setAppBarTitle('Dashboard'));
    }, []);

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
            <section className="dashboard-section">
                <Stack  gap={2} padding={1} width={'100%'}>
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
                </Stack>
                <Stack gap={2} padding={1}>
                    <Card>
                        <Stack margin={2}>
                            <Typography variant='h5'>Occupancy rate</Typography>
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={data}
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
                        </Stack>
                    </Card>
                    <Card > 
                        <Stack margin={2}>
                            <Typography variant='h5'>Check-in/check-out today</Typography>
                            <Typography variant='body1'>Arrivals: 35</Typography>
                            <Typography variant='body1'>Departures: 28</Typography>
                        </Stack>
                    </Card>
                    <Card >
                    <Stack margin={2}>
                        <Typography variant='h5'>Room status</Typography>
                        <ul>
                            <li>Booked: 20</li>
                            <li>Checked in: 45</li>
                            <li>To be maintained: 15</li>
                        </ul>
                        </Stack>
                    </Card>
                </Stack>
            </section>
        </div>
    );
}