import express from "express";
import {IGuestDAO} from "../database/guests";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import {Guest} from "@hotel-management-system/models"
import Joi from "joi";
import strings from "../util/strings";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";


export interface IGuestRoute {
    router: express.Router
}

const makeGuestsRoute = (
    guestsDAO: IGuestDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
) => {
    const {
        getGuests,
        addGuest,
        updateGuest,
        deleteGuest,
        checkGuestExistsById,
        getGuestById,
        searchGuests,
        getPaymentMethodsByGuestId
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

    router.get("/search", authentication, authorization('guests.read'), async (req, res) => {
        try {
            const query = req.query.q;

            if (query === undefined || query === null || query === "") {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.queryNotProvided,
                    data: null
                })
            }

            const users = await searchGuests(query.toString());

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: users
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

    router.get("/:guestId/payment-methods", authentication, authorization("paymentMethods.read"), async (req: express.Request, res: express.Response) => {
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

            const paymentMethods = await getPaymentMethodsByGuestId(guestId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Payment methods fetched successfully",
                data: paymentMethods,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch payment methods",
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
                email: Joi.string().optional().allow(""),
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
                email: req.body.email,
            }

            const guest = await addGuest(newGuest);

            log(
                LogEventTypes.GUEST_ADD,
                req.userId,
                "Added a new guest with id: " + guest.guestId + " and name: " + guest.firstName + " " + guest.lastName,
            )
            
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
                email: Joi.string().optional().allow(""),
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
                email: req.body.email,
            }

            const guest = await updateGuest(updatedGuest);

            log(
                LogEventTypes.GUEST_UPDATE,
                req.userId,
                "Updated guest with id: " + guestId + " to name: " + req.body.firstName + " " + req.body.lastName,
            )

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

            log(
                LogEventTypes.GUEST_DELETE,
                req.userId,
                "Deleted guest with id: " + guestId,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Guest deleted successfully",
                data: null,
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