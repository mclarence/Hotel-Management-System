import express from "express";
import {ILogsDAO} from "../database/logs"; // Adjust for function
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import strings from "../util/strings";

interface IMakeLogsRoute {
    router: express.Router;
}

const makeLogsRoute = (
    logsDAO: ILogsDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): IMakeLogsRoute => {
    const router = express.Router();

    const {
        getAllLogs,
    } = logsDAO;

    router.get("/", authentication, authorization("logs.read"), async (req, res) => {
        try {
            const logs = await getAllLogs();

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: logs
            })
        } catch (error) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: error
            })
        }
    })
    return {
        router
    }
};

export default makeLogsRoute;