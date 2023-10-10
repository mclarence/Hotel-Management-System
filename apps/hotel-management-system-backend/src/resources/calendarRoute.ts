import express from "express";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import {INotesDAO} from "../database/calendar";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import strings from "../util/strings";
import Joi from "joi";
import {CalendarNotes} from "@hotel-management-system/models";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";
import dayjs from "dayjs";
import "dayjs/plugin/utc";

export interface ICalendarRoute {
    router: express.Router
}

export const makeCalendarRoute = (
    calendarDAO: INotesDAO,
    log: IEventLogger,
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

    router.get("/:date", authentication, authorization("calendar.get"), async (req: express.Request, res: express.Response) => {
        const date = req.params.date;
        const parsedDate = dayjs.utc(date).toDate();
        console.log(date)
        const note = await getNoteByDate(parsedDate);

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.success,
            data: note,
        });
    })

    router.post("/add", authentication, authorization("calendar.add"), async (req: express.Request, res: express.Response) => {
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

            const parsedDate = dayjs.utc(req.body.date).toDate();

            const newNote: CalendarNotes = {
                date: parsedDate,
                note: req.body.note,
            }

            const note = await addNoteToDate(newNote);

            log(
                LogEventTypes.CALENDAR_NOTE_CREATE,
                req.userId,
                "Created a new note for date: " + req.body.date + " with note: " + req.body.note,
            )

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

    router.patch("/:noteId", authentication, authorization("calendar.edit"), async (req: express.Request, res: express.Response) => {
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

            const parsedDate = dayjs.utc(req.body.date).toDate();

            const updatedNote: CalendarNotes = {
                noteId: noteId,
                date: parsedDate,
                note: req.body.note,
            }

            const note = await updateNote(updatedNote);

            log(
                LogEventTypes.CALENDAR_NOTE_UPDATE,
                req.userId,
                "Updated note with id: " + noteId + " to date: " + req.body.date + " with note: " + req.body.note,
            )

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

    router.delete("/:noteId", authentication, authorization("calendar.delete"), async (req: express.Request, res: express.Response) => {
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

            log(
                LogEventTypes.CALENDAR_NOTE_DELETE,
                req.userId,
                "Deleted note with id: " + noteId,
            )

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
