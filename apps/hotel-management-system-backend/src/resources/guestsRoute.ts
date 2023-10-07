import express from "express";
import { IGuestDAO } from "../database/guests";
import { IAuthenticationMiddleware } from "../middleware/authentication";
import { IAuthorizationMiddleware } from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import {Guest} from "@hotel-management-system/models"
import Joi from "joi";


export interface IGuestRoute {
    router: express.Router
}

const makeGuestsRoute = (
    guestsDAO: IGuestDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
) => {
    const {
        getGuests,
        addGuest,
        updateGuest,
        deleteGuest,
        checkGuestExistsById,
        getGuestById
    } = guestsDAO

    const router = express.Router();

    router.get("/", authentication, authorization("guests.read"), async (req: express.Request, res: express.Response) => {
        try {
            const guests = await getGuests();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Guests fetched successfully",
                data: guests,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch guests",
                data: err.message,
            })
        }
    })

    router.get("/:guestId", authentication, authorization("guests.read"), async (req: express.Request, res: express.Response) => {
        try {
            const guestId = parseInt(req.params.guestId);

            if (isNaN(guestId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Invalid guest id",
                    data: null,
                })
            }
            const guest = await getGuestById(guestId);

            if (guest === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                })
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Guest fetched successfully",
                data: guest,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch guest",
                data: err.message,
            })
        }
    })

    router.post("/add", authentication, authorization("guests.create"), async (req: express.Request, res: express.Response) => {
        try {
            const schema = Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                phoneNumber: Joi.string().optional().allow(""),
                address: Joi.string().optional().allow(""),
                emailAddress: Joi.string().optional().allow(""),
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Invalid request body",
                    data: error.message,
                })
            }

            const newGuest: Guest = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                emailAddress: req.body.emailAddress,
            }

            const guest = await addGuest(newGuest);
            
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: "Guest added successfully",
                data: guest,
            })

        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to add guest",
                data: err.message,
            })
        }
    }) 

    router.patch("/:guestId", authentication, authorization("guests.update"), async (req: express.Request, res: express.Response) => {
        try {
            const guestId = parseInt(req.params.guestId);

            if (isNaN(guestId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Invalid guest id",
                    data: null,
                })
            }
            // check if guest exists
            const guestExists = await checkGuestExistsById(guestId);

            if (!guestExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                })
            }

            const schema = Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                phoneNumber: Joi.string().optional().allow(""),
                address: Joi.string().optional().allow(""),
                emailAddress: Joi.string().optional().allow(""),
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Invalid request body",
                    data: error.message,
                })
            }

            const updatedGuest: Guest = {
                guestId: guestId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                emailAddress: req.body.emailAddress,
            }

            const guest = await updateGuest(updatedGuest);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Guest updated successfully",
                data: guest,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to update guest",
                data: err.message,
            })
        }
    })

    router.delete("/:guestId", authentication, authorization("guests.delete"), async (req: express.Request, res: express.Response) => {
        try {
            const guestId = parseInt(req.params.guestId);

            if (isNaN(guestId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Invalid guest id",
                    data: null,
                })
            }

            // check if guest exists
            const guestExists = await checkGuestExistsById(guestId);

            if (!guestExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                })
            }

            const guest = await deleteGuest(guestId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Guest deleted successfully",
                data: guest,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to delete guest",
                data: err.message,
            })
        }
    })

    return {
        router
    }
}

export default makeGuestsRoute;