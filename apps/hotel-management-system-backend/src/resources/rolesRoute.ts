import express from "express";
import {IRolesDAO} from "../database/roles";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import {Role} from "@hotel-management-system/models"
import Joi from "joi";

export interface IRolesRoute {
    router: express.Router
}


const makeRolesRoute = (
    rolesDAO: IRolesDAO,
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

    router.post("/add", authentication, authorization("roles.add"), async (req: express.Request, res: express.Response) => {
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
                    message: "Invalid request body",
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

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: "Role added successfully",
                data: role,
            })
            
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to add role",
                data: err.message,
            })
        }
    })

    router.delete("/:roleId", authentication, authorization("roles.delete"), async (req: express.Request, res: express.Response) => {
        try {
            const roleId = parseInt(req.params.roleId);

            // check if role exists
            const roleExists = await checkRoleExists(roleId);

            if (!roleExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Role not found",
                    data: null,
                })
            }

            // check if any user has this role
            const usersWithRole = await getUsersWithRoles(roleId);

            if (usersWithRole.length > 0) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Cannot delete role as there are users with this role",
                    data: null,
                })
            }

            const role = await deleteRole(roleId);
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Role deleted successfully",
                data: role,
            })
        } catch (err) {
            console.log(err)
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to delete role",
                data: err.message,
            })
        }
    })

    router.get("/:roleId", authentication, authorization("roles.read"), async (req: express.Request, res: express.Response) => {
        try {
            const roleId = parseInt(req.params.roleId);

            // check if role exists
            const roleExists = await checkRoleExists(roleId);

            if (!roleExists) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: "Role not found",
                    data: null,
                })
            }

            const role = await getRoleById(roleId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: "Role fetched successfully",
                data: role,
            })
        } catch (err) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch role",
                data: err.message,
            })
        }
    })

    return {
        router
    }
}

export default makeRolesRoute;