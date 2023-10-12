import express from 'express';
import {IAuthenticationMiddleware} from '../middleware/authentication';
import {IAuthorizationMiddleware} from '../middleware/authorization';
import {IRoomsDAO} from '../database/rooms';
import {StatusCodes} from 'http-status-codes';
import sendResponse from '../util/sendResponse';
import strings from '../util/strings';
import Joi from 'joi';
import {Room, RoomStatuses} from '@hotel-management-system/models';
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";

interface IRoomsRoute {
    router: express.Router
}

/**
 * Rooms Route
 * @param roomsDAO - rooms DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
export const makeRoomsRoute = (
    roomsDAO: IRoomsDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware
): IRoomsRoute => {

    const router = express.Router();

    const {
        getRooms,
        getRoomById,
        createRoom,
        checkRoomExistsById,
        updateRoom,
        deleteRoom,
        checkRoomExistsByRoomCode,
        searchRoomsByRoomCode,
        getRoomStatusCount,
        getReservationsByRoomId
    } = roomsDAO

    /**
     * GET /api/rooms
     * Get all rooms
     */
    router.get('/', authentication, authorization('rooms.read'), async (req: any, res, next) => {
        try {
            try {
                const rooms = await getRooms();
                return sendResponse(res, {
                    success: true,
                    statusCode: StatusCodes.OK,
                    message: "Success",
                    data: rooms
                })
            } catch (e) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "An unknown error has occurred, please try again later.",
                    data: e
                })
            }
        } catch (e) {
            next(e);
        }
    });

    /**
     * GET /api/rooms/room-status-count
     * Get room status count
     */
    router.get('/room-status-count', authentication, authorization('rooms.read'), async (req: express.Request, res: express.Response, next) => {
        try {
            const roomStatusCount = await getRoomStatusCount();

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: roomStatusCount
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * GET /api/rooms/search?q=roomCode
     * Search rooms by roomCode
     */
    router.get('/search', authentication, authorization('rooms.read'), async (req: express.Request, res: express.Response, next) => {
        try {
            const roomCode = req.query.q;

            // check if query is provided
            if (!roomCode) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.generic.queryNotProvided,
                    data: null
                })
            }

            const rooms = await searchRoomsByRoomCode(roomCode as string);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: rooms
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * GET /api/rooms/:roomId
     * Get room by id
     */
    router.get('/:roomId', authentication, authorization('rooms.read'), async (req: express.Request, res: express.Response, next) => {
        try {
            const roomId = parseInt(req.params.roomId);

            if (isNaN(roomId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.room.invalidRoomId(roomId),
                    data: null
                })
            }

            const room = await getRoomById(roomId);

            if (room === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.room.roomNotFound(roomId),
                    data: null
                })
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: room
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * POST /api/rooms/add
     * Adds a new room
     */
    router.post("/add", authentication, authorization('rooms.write'), async (req: express.Request, res: express.Response, next) => {
        try {
            const schema = Joi.object({
                roomCode: Joi.string().required(),
                pricePerNight: Joi.number().required(),
                description: Joi.string().required(),
                status: Joi.string().required().valid(...Object.values(RoomStatuses))
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.details[0].message,
                    data: null
                })
            }

            // check if room with roomCode already exists
            const roomCodeExists = await checkRoomExistsByRoomCode(req.body.roomCode);

            if (roomCodeExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.CONFLICT,
                    message: strings.api.room.roomCodeConflict(req.body.roomCode),
                    data: null
                })
            }

            const room: Room = {
                roomCode: req.body.roomCode,
                pricePerNight: req.body.pricePerNight,
                description: req.body.description,
                status: req.body.status
            }

            const newRoom = await createRoom(room);

            log(
                LogEventTypes.ROOM_CREATE,
                req.userId,
                "Created a new room with roomCode: " + req.body.roomCode + " and pricePerNight: " + req.body.pricePerNight,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: strings.api.generic.success,
                data: newRoom
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * PATCH /api/rooms/:roomId
     * Updates a room
     */
    router.patch("/:roomId", authentication, authorization('rooms.write'), async (req: express.Request, res: express.Response, next) => {
        try {
            const roomId = parseInt(req.params.roomId);

            if (isNaN(roomId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.room.invalidRoomId(roomId),
                    data: null
                })
            }

            const schema = Joi.object({
                roomCode: Joi.string().required(),
                pricePerNight: Joi.number().required(),
                description: Joi.string().required(),
                status: Joi.string().required().valid(...Object.values(RoomStatuses))
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.details[0].message,
                    data: null
                })
            }

            const room: Room = {
                roomId: roomId,
                roomCode: req.body.roomCode,
                pricePerNight: req.body.pricePerNight,
                description: req.body.description,
                status: req.body.status
            }

            const roomExists = await checkRoomExistsById(roomId);

            if (!roomExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.room.roomNotFound(roomId),
                    data: null
                })
            }

            const updatedRoom = await updateRoom(room);

            log(
                LogEventTypes.ROOM_UPDATE,
                req.userId,
                "Updated room with id: " + roomId + " to roomCode: " + req.body.roomCode + " and pricePerNight: " + req.body.pricePerNight,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: updatedRoom
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * DELETE /api/rooms/:roomId
     * Deletes a room
     */
    router.delete("/:roomId", authentication, authorization('rooms.write'), async (req: express.Request, res: express.Response, next) => {
        try {
            const roomId = parseInt(req.params.roomId);

            if (isNaN(roomId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.room.invalidRoomId(roomId),
                    data: null
                })
            }

            const roomExists = await checkRoomExistsById(roomId);

            if (!roomExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.room.roomNotFound(roomId),
                    data: null
                })
            }

            const reservationsWithRoom = await getReservationsByRoomId(roomId);

            if (reservationsWithRoom.length > 0) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Cannot delete room as it has reservations",
                    data: null
                })
            }

            await deleteRoom(roomId);

            log(
                LogEventTypes.ROOM_DELETE,
                req.userId,
                "Deleted room with id: " + roomId,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: null
            })
        } catch (e) {
            next(e);
        }
    })

    return {
        router
    }
}