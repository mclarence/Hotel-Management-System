import express from 'express';
import { IAuthenticationMiddleware } from '../middleware/authentication';
import { IAuthorizationMiddleware } from '../middleware/authorization';
import { IRoomsDAO } from '../database/rooms';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../util/sendResponse';
import strings from '../util/strings';
import Joi from 'joi';
import {Room, RoomStatuses} from '@hotel-management-system/models';

interface IRoomsRoute {
    router: express.Router
}

export const makeRoomsRoute = (
    roomsDAO: IRoomsDAO,
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
        searchRoomsByRoomCode
    } = roomsDAO

    /**
     * GET /api/rooms
     * Get all rooms
     */
    router.get('/', authentication, authorization('rooms.read'), async (req: any, res) => {
        try {
            const rooms = await getRooms();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: rooms
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    });

    /**
     * GET /api/rooms/search?q=roomCode
     * Search rooms by roomCode
     */
    router.get('/search', authentication, authorization('rooms.read'), async (req: any, res) => {
        try {
            const roomCode = req.query.q;

            // check if query is provided
            if (!roomCode) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.queryNotProvided,
                    data: null
                })
            }

            const rooms = await searchRoomsByRoomCode(roomCode);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: rooms
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * GET /api/rooms/:roomId
     * Get room by id
     */
    router.get('/:roomId', authentication, authorization('rooms.read'), async (req: any, res) => {
        try {
            const roomId = parseInt(req.params.roomId);

            if (isNaN(roomId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidRoomId,
                    data: null
                })
            }

            const room = await getRoomById(roomId);

            if (room === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.roomIdNotFound(roomId),
                    data: null
                })
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: room
            })


        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * POST /api/rooms/add
     * Adds a new room
     */
    router.post("/add", authentication, authorization('rooms.write'), async (req: any, res) => {
        try {
            const schema = Joi.object({
                roomCode: Joi.string().required(),
                pricePerNight: Joi.number().required(),
                description: Joi.string().required(),
                status: Joi.string().required().valid(...Object.values(RoomStatuses))
            })

            const { error } = schema.validate(req.body);

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
                    message: strings.api.roomConflict(req.body.roomCode),
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

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: strings.api.success,
                data: newRoom
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * PATCH /api/rooms/:roomId
     * Updates a room
     */
    router.patch("/:roomId", authentication, authorization('rooms.write'), async (req: any, res) => {
        try {
            const roomId = parseInt(req.params.roomId);

            if (isNaN(roomId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidRoomId,
                    data: null
                })
            }

            const schema = Joi.object({
                roomCode: Joi.string().required(),
                pricePerNight: Joi.number().required(),
                description: Joi.string().required(),
                status: Joi.string().required().valid(...Object.values(RoomStatuses))
            })

            const { error } = schema.validate(req.body);

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
                    message: strings.api.roomIdNotFound(roomId),
                    data: null
                })
            }
            
            const updatedRoom = await updateRoom(room);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: updatedRoom
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * DELETE /api/rooms/:roomId
     * Deletes a room
     */
    router.delete("/:roomId", authentication, authorization('rooms.write'), async (req: any, res) => {
        try {
            const roomId = parseInt(req.params.roomId);

            if (isNaN(roomId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidRoomId,
                    data: null
                })
            }

            const roomExists = await checkRoomExistsById(roomId);

            if (!roomExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.roomIdNotFound(roomId),
                    data: null
                })
            }

            await deleteRoom(roomId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: null
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    return {
        router
    }
}