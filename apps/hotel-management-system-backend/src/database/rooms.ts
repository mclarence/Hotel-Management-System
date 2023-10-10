import {Room} from "@hotel-management-system/models";
import queries from "./sql/queries";
import {IDatabase} from "pg-promise";
import pgPromise = require("pg-promise");
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;

export interface IRoomsDAO {
    getRooms(): Promise<Room[]>;

    getRoomById(roomId: number): Promise<Room | null>;

    createRoom(room: Room): Promise<Room>;

    checkRoomExistsById(roomId: number): Promise<boolean>;

    updateRoom(room: Room): Promise<Room>;

    deleteRoom(roomId: number): Promise<void>;

    checkRoomExistsByRoomCode(roomCode: string): Promise<boolean>;

    searchRoomsByRoomCode(roomCode: string): Promise<Room[]>;

    getRoomStatusCount() : Promise<{
        status: string,
        count: number
    }[]>;
}

export const makeRoomsDAO = (db: IDatabase<any, any>): IRoomsDAO => {
    const getRooms = async (): Promise<Room[]> => {
        try {
            return await db.any(queries.rooms.getRooms);
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            } else {
                throw err;
            }
        }
    }

    const getRoomById = async (roomId: number): Promise<Room | null> => {
        try {
            return await db.oneOrNone(queries.rooms.getRoomById, [roomId]);
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            } else {
                throw err;
            }
        }
    }

    const checkRoomExistsById = async (roomId: number): Promise<boolean> => {
        const exists = await db.one(queries.rooms.checkRoomExistsById, [roomId]);
        return exists.exists;
    }

    const checkRoomExistsByRoomCode = async (roomCode: string): Promise<boolean> => {
        const exists = await db.one(queries.rooms.checkRoomExistsByRoomCode, [roomCode]);
        return exists.exists;
    }

    const createRoom = async (room: Room): Promise<Room> => {
        return await db.one(queries.rooms.addRoom, [room.roomCode, room.pricePerNight, room.description, room.status]);
    }

    const updateRoom = async (room: Room): Promise<Room> => {
        return await db.one(queries.rooms.updateRoom, [room.roomCode, room.pricePerNight, room.description, room.status, room.roomId]);
    }

    const deleteRoom = async (roomId: number): Promise<void> => {
        await db.none(queries.rooms.deleteRoom, [roomId]);
    }

    const searchRoomsByRoomCode = async (roomCode: string): Promise<Room[]> => {
        return await db.any(queries.rooms.searchRooms, [roomCode]);
    }

    const getRoomStatusCount = async (): Promise<{status: string, count: number}[]> => {
        return await db.any(queries.rooms.getStatusCount)
    }

    return {
        getRooms,
        getRoomById,
        createRoom,
        checkRoomExistsById,
        updateRoom,
        deleteRoom,
        checkRoomExistsByRoomCode,
        searchRoomsByRoomCode,
        getRoomStatusCount
    }
}