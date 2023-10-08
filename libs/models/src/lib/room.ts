import {RoomStatuses} from "./enums/RoomStatuses";

export type Room = {
    roomId?: number;
    roomCode: string;
    pricePerNight: number;
    description: string;
    status: RoomStatuses;
}