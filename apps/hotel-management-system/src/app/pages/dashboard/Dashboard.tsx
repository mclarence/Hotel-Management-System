import React, {useEffect, useState} from 'react';
import './HotelDashboard.css';
import {Cell, Pie, PieChart, Tooltip} from 'recharts';
import RoomCard from './RoomCard';
import RoomFilterBar from './RoomFilterBar';
import {Card, Stack, Typography} from '@mui/material';
import {useAppDispatch} from "../../redux/hooks";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {searchReservations} from "../../api/resources/reservations";
import {Reservation, Room, RoomStatuses} from "@hotel-management-system/models";
import {getRooms, getRoomStatusCount} from "../../api/resources/rooms";
import {makeApiRequest} from "../../api/makeApiRequest";
import dayjs from "dayjs";

export function Dashboard() {
    const dispatch = useAppDispatch();
    const appState = useSelector((state: RootState) => state.appState);
    const navigate = useNavigate();
    const [checkInsToday, setCheckInsToday] = useState(0);
    const [checkOutsToday, setCheckOutsToday] = useState(0);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [pieChartData, setPieChartData] = useState<{ status: string, count: number }[]>([]);

    useEffect(() => {
        const currentDate = dayjs.utc()

        makeApiRequest<{ status: string, count: string }[]>(
            getRoomStatusCount(),
            dispatch,
            (data) => {
                setPieChartData(data.map((item) => {
                    return {
                        status: item.status,
                        count: parseInt(item.count)
                    }
                }))
            }
        )

        makeApiRequest<Reservation[]>(
            searchReservations({
                checkInDate: currentDate,
            }),
            dispatch,
            (data) => {
                setCheckInsToday(data.length);
            })

        makeApiRequest<Reservation[]>(
            searchReservations({
                checkOutDate: currentDate,
            }),
            dispatch,
            (data) => {
                setCheckOutsToday(data.length);
            }
        )

        makeApiRequest<Room[]>(
            getRooms(),
            dispatch,
            (data) => {
                setRooms(data);
            }
        )

    }, []);


    const colours: {
        [key: string]: string
    } = {
        [RoomStatuses.AVAILABLE]: '#00C49F',
        [RoomStatuses.OUT_OF_SERVICE]: '#FF8042',
        [RoomStatuses.UNAVAILABLE]: '#FFBB28',
        [RoomStatuses.OCCUPIED]: '#0088FE',
        [RoomStatuses.RESERVED]: '#FF8042'
    }

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
                                roomInfo={room.description}
                                roomStatus={room.status}
                            />
                        ))}
                    </div>
                </Stack>
                <Stack gap={2} padding={1}>
                    <Card>
                        <Stack margin={2}>
                            <Typography variant='h5'>Room Status Overview</Typography>
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={pieChartData}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="status"
                                    label
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colours[entry.status]}/>
                                    ))}
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
                </Stack>
            </section>
        </div>
);
}