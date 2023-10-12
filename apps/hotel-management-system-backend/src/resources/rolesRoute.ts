import express from "express";
import {IRolesDAO} from "../database/roles";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import {Role} from "@hotel-management-system/models"
import Joi from "joi";
import {IEventLogger} from "../util/logEvent";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";
import strings from "../util/strings";

export interface IRolesRoute {
    router: express.Router
}

/**
 * Roles Route
 * @param rolesDAO - roles DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeRolesRoute = (
    rolesDAO: IRolesDAO,
    log: IEventLogger,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
): IRolesRoute => {
    const {
        getAllRoles,
        addRole,
        deleteRole,
        checkRoleExists,
        getUsersWithRoles,
        getRoleById
    } = rolesDAO

    const router = express.Router();

    /**
     * HTTP GET /api/roles
     * Get all roles
     */
    router.get("/", authentication, authorization("roles.read"), async (req: express.Request, res: express.Response, next) => {
        try {
            const roles = await getAllRoles();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: roles,
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * HTTP POST /api/roles/add
     * Add a new role
     */
    router.post("/add", authentication, authorization("roles.add"), async (req: express.Request, res: express.Response, next) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                permissionData: Joi.array().items(Joi.string()).required()
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

            // TODO: validate if permissions are valid
            // TODO: check if a role with the same name already exists

            const newRole: Role = {
                name: req.body.name,
                permissionData: req.body.permissionData
            }

            const role = await addRole(newRole);

            log(
                LogEventTypes.ROLE_CREATE,
                req.userId,
                "Created a new role with name: " + req.body.name + " and permissions: " + req.body.permissionData,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: strings.api.generic.success,
                data: role,
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * HTTP DELETE /api/roles/:roleId
     * Delete a role
     */
    router.delete("/:roleId", authentication, authorization("roles.delete"), async (req: express.Request, res: express.Response, next) => {
        try {
            const roleId = parseInt(req.params.roleId);

            // check if role exists
            const roleExists = await checkRoleExists(roleId);

            if (!roleExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.roles.roleNotFound(roleId),
                    data: null,
                })
            }

            // check if any user has this role
            const usersWithRole = await getUsersWithRoles(roleId);

            if (usersWithRole.length > 0) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.roles.cannotDeleteRoleAsOtherUsersHaveIt,
                    data: null,
                })
            }

            const role = await deleteRole(roleId);

            log(
                LogEventTypes.ROLE_DELETE,
                req.userId,
                "Deleted role with id: " + roleId,
            )

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: role,
            })
        } catch (e) {
            next(e);
        }
    })

    /**
     * HTTP GET /api/roles/:roleId
     * Get role by id
     */
    router.get("/:roleId", authentication, authorization("roles.read"), async (req: express.Request, res: express.Response, next) => {
        try {
            const roleId = parseInt(req.params.roleId);

            // check if role exists
            const roleExists = await checkRoleExists(roleId);

            if (!roleExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.roles.roleNotFound(roleId),
                    data: null,
                })
            }

            const role = await getRoleById(roleId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.generic.success,
                data: role,
            })
        } catch (e) {
            next(e);
        }
    })

    return {
        router
    }
}

export default makeRolesRoute;