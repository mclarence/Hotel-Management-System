import express from "express";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import {INotesDAO} from "../database/calendar";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import strings from "../util/strings";
import Joi from "joi";
import {CalendarNotes} from "@hotel-management-system/models";

export interface ICalendarRoute {
    router: express.Router
}

export const makeCalendarRoute = (
    calendarDAO: INotesDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): ICalendarRoute => {
    const {
        getNoteByDate,
        addNoteToDate,
        checkNoteExistsById,
        updateNote
    } = calendarDAO

    const router = express.Router();

    router.get("/:date", authentication, authorization("calendar.get"), async (req, res) => {
        const date = req.params.date;
        const parsedDate = new Date(date);
        console.log(date)
        const note = await getNoteByDate(parsedDate);

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.success,
            data: note,
        });
    })

    router.post("/add", authentication, authorization("calendar.add"), async (req, res) => {
        try {
            const schema = Joi.object({
                date: Joi.date().required(),
                note: Joi.string().required(),
            })

            const { error } = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                })
            }

            const newNote: CalendarNotes = {
                date: req.body.date,
                note: req.body.note,
            }

            const note = await addNoteToDate(newNote);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: note,
            })

        } catch (error) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: error,
            })
        }
    })

    router.patch("/:noteId", authentication, authorization("calendar.edit"), async (req, res) => {
        try {
            const noteId = parseInt(req.params.noteId)

            if (isNaN(noteId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidNoteId,
                    data: null,
                })
            }

            // check if note exists
            const noteExists = await checkNoteExistsById(noteId);

            if (!noteExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.noteNotFound(noteId),
                    data: null,
                })
            }

            const schema = Joi.object({
                date: Joi.date().required(),
                note: Joi.string().required(),
            })

            const { error } = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                })
            }

            const updatedNote: CalendarNotes = {
                noteId: noteId,
                date: req.body.date,
                note: req.body.note,
            }

            const note = await updateNote(updatedNote);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: note,
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e,
            })
        }
    })

    router.delete("/:noteId", authentication, authorization("calendar.delete"), async (req, res) => {
        try {
            const noteId = parseInt(req.params.noteId)

            if(isNaN(noteId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidNoteId,
                    data: null,
                })
            }

            // check if note exists
            const noteExists = await checkNoteExistsById(noteId);

            if(!noteExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.noteNotFound(noteId),
                    data: null,
                })
            }

            await calendarDAO.deleteNote(noteId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: null,
            })
        } catch (error) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: null,
            })
        }
    })

    return {
        router
    }
}
