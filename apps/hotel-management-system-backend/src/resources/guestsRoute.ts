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

/**
 * Guest Route
 * BASE URL: /api/guests
 */
export interface IGuestRoute {
    router: express.Router
}

/**
 * Guest Route
 * @param guestsDAO - guests DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
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

    /**
     * HTTP GET /api/guests
     * Get all guests
     */
    router.get("/", authentication, authorization("guests.read"), async (req: express.Request, res: express.Response) => {
        const guests = await getGuests();
        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.generic.success,
            data: guests,
        })
    })

    /**
     * HTTP GET /api/guests/search?q=...
     * Search guests
     */
    router.get("/search", authentication, authorization('guests.read'), async (req, res) => {
        const query = req.query.q;

        if (query === undefined || query === null || query === "") {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.generic.queryNotProvided,
                data: null
            })
        }

        const users = await searchGuests(query.toString());

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.generic.success,
            data: users
        })
    })

    /**
     * HTTP GET /api/guests/:guestId/payment-methods
     * Get payment methods by guest id
     */
    router.get("/:guestId/payment-methods", authentication, authorization("paymentMethods.read"), async (req: express.Request, res: express.Response) => {
        const guestId = parseInt(req.params.guestId);

        if (isNaN(guestId)) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.guest.invalidGuestId(guestId),
                data: null,
            })
        }

        // check if guest exists
        const guestExists = await checkGuestExistsById(guestId);

        if (!guestExists) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: strings.api.guest.guestNotFound(guestId),
                data: null,
            })
        }

        const paymentMethods = await getPaymentMethodsByGuestId(guestId);

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.generic.success,
            data: paymentMethods,
        })
    })

    /**
     * HTTP GET /api/guests/:guestId
     * Get guest by id
     */
    router.get("/:guestId", authentication, authorization("guests.read"), async (req: express.Request, res: express.Response) => {
        const guestId = parseInt(req.params.guestId);

        if (isNaN(guestId)) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.guest.invalidGuestId(guestId),
                data: null,
            })
        }
        const guest = await getGuestById(guestId);

        if (guest === null) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: strings.api.guest.guestNotFound(guestId),
                data: null,
            })
        }

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.generic.success,
            data: guest,
        })
    })

    /**
     * HTTP POST /api/guests/add
     * Add a new guest
     */
    router.post("/add", authentication, authorization("guests.create"), async (req: express.Request, res: express.Response) => {
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
                message: strings.api.generic.invalidRequestBody,
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
            message: strings.api.generic.success,
            data: guest,
        })
    })

    /**
     * HTTP PATCH /api/guests/:guestId
     * Update guest by id
     */
    router.patch("/:guestId", authentication, authorization("guests.update"), async (req: express.Request, res: express.Response) => {
        const guestId = parseInt(req.params.guestId);

        if (isNaN(guestId)) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.guest.invalidGuestId(guestId),
                data: null,
            })
        }
        // check if guest exists
        const guestExists = await checkGuestExistsById(guestId);

        if (!guestExists) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: strings.api.guest.guestNotFound(guestId),
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
                message: strings.api.generic.invalidRequestBody,
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
            message: strings.api.generic.success,
            data: guest,
        })
    })

    /**
     * HTTP DELETE /api/guests/:guestId
     * Delete guest by id
     */
    router.delete("/:guestId", authentication, authorization("guests.delete"), async (req: express.Request, res: express.Response) => {
        const guestId = parseInt(req.params.guestId);

        if (isNaN(guestId)) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.guest.invalidGuestId(guestId),
                data: null,
            })
        }

        // check if guest exists
        const guestExists = await checkGuestExistsById(guestId);

        if (!guestExists) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: strings.api.guest.guestNotFound(guestId),
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
            message: strings.api.generic.success,
            data: null,
        })
    })


    return {
        router
    }
}

export default makeGuestsRoute;