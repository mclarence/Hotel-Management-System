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

/**
 * Calender Route
 * BASE URL: /api/calendar
 */

export interface ICalendarRoute {
    router: express.Router
}

/**
 * Calendar Route
 * @param calendarDAO - calendar DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
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

    /**
     * HTTP GET /api/calendar/:date
     * Get note by date
     */
    router.get("/:date", authentication, authorization("calendar.get"), async (req: express.Request, res: express.Response) => {
        const date = req.params.date;
        const parsedDate = dayjs.utc(date).toDate();
        const note = await getNoteByDate(parsedDate);

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.generic.success,
            data: note,
        });
    })

    /**
     * HTTP POST /api/calendar/add
     * Add note to date
     */
    router.post("/add", authentication, authorization("calendar.add"), async (req: express.Request, res: express.Response) => {
        const schema = Joi.object({
            date: Joi.date().required(),
            note: Joi.string().required(),
        })

        const {error} = schema.validate(req.body);

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
            statusCode: StatusCodes.CREATED,
            message: strings.api.generic.success,
            data: note,
        })
    })

    /**
     * HTTP PATCH /api/calendar/:noteId
     * Update note
     */
    router.patch("/:noteId", authentication, authorization("calendar.edit"), async (req: express.Request, res: express.Response) => {
        const noteId = parseInt(req.params.noteId)

        if (isNaN(noteId)) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.notes.invalidNoteId(noteId),
                data: null,
            })
        }

        // check if note exists
        const noteExists = await checkNoteExistsById(noteId);

        if (!noteExists) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: strings.api.notes.noteNotFound(noteId),
                data: null,
            })
        }

        const schema = Joi.object({
            date: Joi.date().required(),
            note: Joi.string().required(),
        })

        const {error} = schema.validate(req.body);

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
            message: strings.api.generic.success,
            data: note,
        })
    })

    /**
     * HTTP DELETE /api/calendar/:noteId
     * Delete note
     */
    router.delete("/:noteId", authentication, authorization("calendar.delete"), async (req: express.Request, res: express.Response) => {
        const noteId = parseInt(req.params.noteId)

        if (isNaN(noteId)) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: strings.api.notes.invalidNoteId(noteId),
                data: null,
            })
        }

        // check if note exists
        const noteExists = await checkNoteExistsById(noteId);

        if (!noteExists) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: strings.api.notes.noteNotFound(noteId),
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
            message: strings.api.generic.success,
            data: null,
        })
    })

    return {
        router
    }
}
