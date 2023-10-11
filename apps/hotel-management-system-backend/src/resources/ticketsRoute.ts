import express from "express";
import {IUsersDAO} from "../database/users";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import {ITicketsDAO} from "../database/tickets";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import Joi from "joi";
import {Ticket, TicketMessages, TicketStatuses} from "@hotel-management-system/models";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";
import dayjs from "dayjs";
import strings from "../util/strings";
import queries from "../database/sql/queries";

interface ITicketsRoute {
    router: express.Router;
}

export const makeTicketsRoute = (
    ticketsDAO: ITicketsDAO,
    usersDAO: IUsersDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware
): ITicketsRoute => {
    const router = express.Router();

    const {addCommentToTicket, addTicket, deleteTicket, getAllTickets, getTicketById, updateTicket, checkTicketExistsById, getTicketComments} = ticketsDAO
    const {checkUserExists, checkUserExistsById, createUser, deleteUser, getUserById, getUserByUsername, getUsers, searchUsers, updateUser} = usersDAO

    /**
     * Get all tickets-page
     */
    router.get("/", authentication, authorization("tickets-page.create"), async (req, res) => {
        const tickets = await getAllTickets();
        return sendResponse(res, {
            success: true,
            data: tickets,
            message: strings.api.generic.success,
            statusCode: StatusCodes.OK
        })
    })

    /**
     * Get ticket comments
     */
    router.get("/:ticketId/comments", authentication, authorization("tickets-page.create"), async (req, res) => {
        const ticketId = parseInt(req.params.ticketId);

        if (isNaN(ticketId)) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.invalidTicketId(req.params.ticketId),
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        const ticketExists = await checkTicketExistsById(ticketId);

        if (!ticketExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.ticketNotFound(ticketId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        const comments = await getTicketComments(ticketId);

        return sendResponse(res, {
            success: true,
            data: comments,
            message: strings.api.generic.success,
            statusCode: StatusCodes.OK
        })
    })

    /**
     * Add comment to ticket
     */
    router.post("/:ticketId/comments/add", authentication, authorization("tickets-page.create"), async (req, res) => {
        const ticketId = parseInt(req.params.ticketId);

        if (isNaN(ticketId)) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.invalidTicketId(req.params.ticketId),
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        const schema = Joi.object({
            userId: Joi.number().required(),
            message: Joi.string().required(),
            dateCreated: Joi.date().required()
        })

        const {error} = schema.validate(req.body);

        if (error) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: error.message,
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        // Check if ticket exists
        const ticketExists = await checkTicketExistsById(ticketId);

        if (!ticketExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.ticketNotFound(ticketId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        // Check if user exists
        const userExists = await checkUserExistsById(req.body.userId);

        if (!userExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.users.userNotFound(req.body.userId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        const parsedDate = dayjs.utc(req.body.dateCreated).toDate()

        const newTicketMessage: TicketMessages = {
            ticketId: ticketId,
            userId: req.body.userId,
            message: req.body.message,
            dateCreated: parsedDate
        }

        const message = await addCommentToTicket(newTicketMessage);

        log(
            LogEventTypes.TICKET_COMMENT_CREATE,
            req.userId,
            "Added a new comment to ticket with id: " + ticketId + " with message: " + req.body.message,
        )

        return sendResponse(res, {
            success: true,
            data: message,
            message: strings.api.generic.success,
            statusCode: StatusCodes.CREATED
        })
    })

    /**
     * Get Ticket by ID
     */
    router.get("/:ticketId", authentication, authorization("tickets-page.create"), async (req, res) => {
        const ticketId = parseInt(req.params.ticketId);

        if (isNaN(ticketId)) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.invalidTicketId(req.params.ticketId),
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        const ticket = await getTicketById(ticketId);

        if (ticket === null) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.ticketNotFound(ticketId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        return sendResponse(res, {
            success: true,
            data: ticket,
            message: "Success",
            statusCode: StatusCodes.OK
        })
    })

    /**
     * Create a new ticket
     */
    router.post("/add", authentication, authorization("tickets-page.create"), async (req, res) => {
        const schema = Joi.object({
            userId: Joi.number().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            status: Joi.string().required().valid(...Object.values(TicketStatuses)),
            dateOpened: Joi.date().required()
        })

        const {error, value} = schema.validate(req.body);

        if (error) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: error.message,
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        // Check if user exists
        const userExists = await checkUserExistsById(value.userId);

        if (!userExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.users.userNotFound(value.userId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        const ticket = await addTicket(value);

        log(
            LogEventTypes.TICKET_CREATE,
            req.userId,
            "Created a new ticket with title: " + req.body.title + " and description: " + req.body.description,
        )

        return sendResponse(res, {
            success: true,
            data: ticket,
            message: strings.api.generic.success,
            statusCode: StatusCodes.CREATED
        })
    })

    /**
     * Update a ticket
     */
    router.patch("/:ticketId", authentication, authorization("tickets-page.create"), async (req, res) => {
        const ticketId = parseInt(req.params.ticketId);

        if (isNaN(ticketId)) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.invalidTicketId(req.params.ticketId),
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        const schema = Joi.object({
            userId: Joi.number().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            status: Joi.string().required().valid(...Object.values(TicketStatuses)),
            dateOpened: Joi.date().required()
        })

        const {error, value} = schema.validate(req.body);

        if (error) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: error.message,
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        // check if ticket exists
        const ticketExists = await checkTicketExistsById(ticketId);

        if (!ticketExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.ticketNotFound(ticketId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        // check if user exists
        const userExists = await checkUserExistsById(value.userId);
        if (!userExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.users.userNotFound(value.userId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        const updatedTicket: Ticket = {
            ticketId: ticketId,
            userId: value.userId,
            title: value.title,
            description: value.description,
            status: value.status,
            dateOpened: value.dateOpened
        }

        const ticket = await updateTicket(updatedTicket);

        log(
            LogEventTypes.TICKET_UPDATE,
            req.userId,
            "Updated ticket with id: " + ticketId + " with title: " + req.body.title + " and description: " + req.body.description,
        )

        return sendResponse(res, {
            success: true,
            data: ticket,
            message: strings.api.generic.success,
            statusCode: StatusCodes.OK
        })
    })

    /**
     * Delete a ticket
     */
    router.delete("/:ticketId", authentication, authorization("tickets-page.create"), async (req, res) => {
        const ticketId = parseInt(req.params.ticketId);

        if (isNaN(ticketId)) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.invalidTicketId(req.params.ticketId),
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        // check if ticket exists
        const ticketExists = await checkTicketExistsById(ticketId);

        if (!ticketExists) {
            return sendResponse(res, {
                success: false,
                data: null,
                message: strings.api.tickets.ticketNotFound(ticketId),
                statusCode: StatusCodes.NOT_FOUND
            })
        }

        await deleteTicket(ticketId);

        log(
            LogEventTypes.TICKET_DELETE,
            req.userId,
            "Deleted ticket with id: " + ticketId,
        )

        return sendResponse(res, {
            success: true,
            data: null,
            message: strings.api.generic.success,
            statusCode: StatusCodes.OK
        })
    })

    return {
        router
    }

}