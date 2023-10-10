import React, {useEffect, useState} from 'react';
import './HotelDashboard.css';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';
import RoomCard from './RoomCard';
import RoomFilterBar from './RoomFilterBar';
import {Card, Stack, Typography} from '@mui/material';
import appStateSlice from '../../redux/slices/AppStateSlice';
import {useAppDispatch} from "../../redux/hooks";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {searchReservations} from "../../api/reservations";
import {ApiResponse, Reservation, Room} from "@hotel-management-system/models";
import {getRooms} from "../../api/rooms";
import {handleApiResponse} from "../../api/handleApiResponse";
import dayjs from "dayjs";

export function Dashboard() {
    const dispatch = useAppDispatch();
    const appState = useSelector((state: RootState) => state.appState);
    const navigate = useNavigate();
    const [checkInsToday, setCheckInsToday] = useState(0);
    const [checkOutsToday, setCheckOutsToday] = useState(0);
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const currentDate = dayjs.utc().utcOffset(0).toDate();

        handleApiResponse<Reservation[]>(
            searchReservations({
                checkInDate: currentDate,
            }),
            dispatch,
            (data) => {
                setCheckInsToday(data.length);
            })

        handleApiResponse<Reservation[]>(
            searchReservations({
                checkOutDate: currentDate,
            }),
            dispatch,
            (data) => {
                setCheckOutsToday(data.length);
            }
        )

        handleApiResponse<Room[]>(
            getRooms(),
            dispatch,
            (data) => {
                setRooms(data);
            }
        )

    }, []);


    const occupancyRate = 78;
    const vacancyRate = 100 - occupancyRate;

    const data = [
        {name: 'OccupancyRate', value: occupancyRate},
        {name: 'VacancyRate', value: vacancyRate},
    ];

    const COLORS = ['#36A2EB', '#FFCE56'];

// 筛选和搜索的状态
    const [filterStatus, setFilterStatus] = useState('');
    const [searchRoomNumber, setSearchRoomNumber] = useState('');

// 根据状态筛选rooms
    const filteredRooms = rooms.filter(room => {
        return (
            (filterStatus === '' || room.status === filterStatus) &&
            (searchRoomNumber === '' || room.roomCode.includes(searchRoomNumber))
        );
    });

    return (
        <div className="dashboard">
            <section className="dashboard-section">
                <Stack gap={2} padding={1} width={'100%'}>
                    <RoomFilterBar
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        searchRoomNumber={searchRoomNumber}
                        setSearchRoomNumber={setSearchRoomNumber}
                    />
                    <div className="rooms-container">
                        {filteredRooms.map(room => (
                            <RoomCard
                                key={room.roomId}
                                roomNumber={room.roomCode}
                                occupantName={""}
                                roomInfo={room.description}
                                roomStatus={room.status}
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
                                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]}/>)
                                    }
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </Stack>
                    </Card>
                    <Card>
                        <Stack margin={2}>
                            <Typography variant='h5'>Today's check-ins and check-outs</Typography>
                            <Typography variant='body1'>Arrivals: {checkInsToday}</Typography>
                            <Typography variant='body1'>Departures: {checkOutsToday}</Typography>
                        </Stack>
                    </Card>
                    <Card>
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