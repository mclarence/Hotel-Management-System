import express from "express";
import { IAuthenticationMiddleware } from "../middleware/authentication";
import { IAuthorizationMiddleware } from "../middleware/authorization";
import { INotesDAO } from "../database/notes";
import { error } from "console";
import sendResponse from "../util/sendResponse";
import { StatusCodes } from "http-status-codes";

export interface ICalendarRoute {
    router: express.Router
}

export const makeCalendarRoute = (
    calendarDAO: INotesDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): ICalendarRoute => {
    const {
        getNoteByDate
    } = calendarDAO

    const router = express.Router();

    router.get("/:date", authentication, authorization("calendar.get"), async (req, res) => {
        const date = req.params.date;
        const parsedDate = new Date(date);
        console.log(date)
        const note = await getNoteByDate(parsedDate);
        if (note === null)
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: "Invalid date",
                data: null,
            })
        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Valid date",
            data: note,
        });
    })

    return {
        router
    }
}
