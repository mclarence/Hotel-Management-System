import {Room} from "@hotel-management-system/models";
import queries from "./sql/queries";
import pgPromise = require("pg-promise");
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
import { IDatabase } from "pg-promise";

export interface IRoomsDAO {
    getRooms(): Promise<Room[]>;
    getRoomById(roomId: number): Promise<Room | null>;
    createRoom(room: Room): Promise<Room>;
    checkRoomExistsById(roomId: number): Promise<boolean>;
    updateRoom(room: Room): Promise<Room>;
    deleteRoom(roomId: number): Promise<void>;
    checkRoomExistsByRoomCode(roomCode: string): Promise<boolean>;
}

export const makeRoomsDAO = (db: IDatabase<any,any>): IRoomsDAO => {
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
            const room = await db.oneOrNone(queries.rooms.getRoomById, [roomId]);
            return room;
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            } else {
                throw err;
            }
        }
    }

    const checkRoomExistsById = async (roomId: number): Promise<boolean> => {
        try {
            const exists = await db.one(queries.rooms.checkRoomExistsById, [roomId]);
            return exists.exists;
        } catch (err) {
            throw err;
        }
    }

    const checkRoomExistsByRoomCode = async (roomCode: string): Promise<boolean> => {
        try {
            const exists = await db.one(queries.rooms.checkRoomExistsByRoomCode, [roomCode]);
            return exists.exists;
        } catch (err) {
            throw err;
        }
    }

    const createRoom = async (room: Room): Promise<Room> => {
        try {
            const newRoom = await db.one(queries.rooms.addRoom, [room.roomCode, room.pricePerNight, room.description, room.status]);
            return newRoom;
        } catch (err) {
            throw err;
        }
    }

    const updateRoom = async (room: Room): Promise<Room> => {
        try {
            const updatedRoom = await db.one(queries.rooms.updateRoom, [room.roomCode, room.pricePerNight, room.description, room.status, room.roomId]);
            return updatedRoom;
        } catch (err) {
            throw err;
        }
    }

    const deleteRoom = async (roomId: number): Promise<void> => {
        try {
            await db.none(queries.rooms.deleteRoom, [roomId]);
        } catch (err) {
            throw err;
        }
    }

    return {
        getRooms,
        getRoomById,
        createRoom,
        checkRoomExistsById,
        updateRoom,
        deleteRoom,
        checkRoomExistsByRoomCode
    }
}