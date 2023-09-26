import express from "express";
import {IRolesDAO} from "../database/roles";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";

export interface IRolesRoute {
    router: express.Router
}


const makeRolesRoute = (
    rolesDAO: IRolesDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): IRolesRoute => {
    const {
        getAllRoles
    } = rolesDAO

    const router = express.Router();

    router.get("/", authentication, authorization("roles.read"), async (req: express.Request, res: express.Response) => {
        try {
            const roles = await getAllRoles();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Roles fetched successfully",
                data: roles,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch roles",
                data: err.message,
            })
        }
    })

    return {
        router
    }
}

export default makeRolesRoute;