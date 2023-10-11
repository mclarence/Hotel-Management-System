import {ApiResponse} from "@hotel-management-system/models";
import strings from "../util/strings";
import {IRolesDAO} from "../database/roles";
import makePermissionChecker from "../util/checkPermissions";

export interface IAuthorizationMiddleware {
    (requiredPermission: string): (req: any, res: any, next: any) => void
}

/**
 * Authorization middleware, handles authorization, checks if the user has the required permission.
 * @param rolesDAO
 */
const makeAuthorizationMiddleware = (rolesDAO: IRolesDAO): IAuthorizationMiddleware => {

    const hasPermission = makePermissionChecker(rolesDAO);

    /**
     * @param requiredPermission - the required permission
     */
    return (requiredPermission: string) => {
        const response: ApiResponse<null> = {
            success: false,
            statusCode: 500,
            message: "An unknown error has occurred, please try again later.",
            data: null
        }

        return async (req, res, next) => {

            // check if the user has a role id
            if (req.userRoleId === undefined) {
                response.statusCode = 401;
                response.message = strings.api.users.unauthenticated;
                return res.status(response.statusCode).send(response);
            }

            // check if the user has the required permission
            const userHasPermission = await hasPermission(requiredPermission, req.userRoleId);
            if (!userHasPermission) {
                response.statusCode = 401;
                response.message = strings.api.users.unauthorized;
                return res.status(response.statusCode).send(response);
            }

            // user has the required permission, continue
            next();
        }
    };

}

export default makeAuthorizationMiddleware;