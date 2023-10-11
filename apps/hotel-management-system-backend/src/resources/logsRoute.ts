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

/**
 * Logs Route
 * @param logsDAO - logs DAO
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeLogsRoute = (
    logsDAO: ILogsDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): IMakeLogsRoute => {
    const router = express.Router();

    const {
        getAllLogs,
    } = logsDAO;

    /**
     * HTTP GET /api/logs
     * Get all logs
     */
    router.get("/", authentication, authorization("logs.read"), async (req: express.Request, res: express.Response) => {
        const logs = await getAllLogs();

        return sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: strings.api.generic.success,
            data: logs
        })
    })
    return {
        router
    }
};

export default makeLogsRoute;