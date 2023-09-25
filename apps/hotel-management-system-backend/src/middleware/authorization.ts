import {ApiResponse} from "@hotel-management-system/models";
import strings from "../util/strings";
import {IRolesDAO} from "../database/roles";
import makePermissionChecker from "../util/checkPermissions";

export interface IAuthorizationMiddleware {
    (requiredPermission: string): (req: any, res: any, next: any) => void
}

const makeAuthorizationMiddleware = (rolesDAO: IRolesDAO): IAuthorizationMiddleware => {

    const hasPermission = makePermissionChecker(rolesDAO);
    return (requiredPermission: string) => {
        const response: ApiResponse<null> = {
            success: false,
            statusCode: 500,
            message: strings.api.serverError,
            data: null
        }
        return async (req, res, next) => {
            if (req.userRoleId === undefined) {
                response.statusCode = 401;
                response.message = strings.api.unauthenticated;
                return res.status(response.statusCode).send(response);
            }

            try {
                const userHasPermission = await hasPermission(requiredPermission, req.userRoleId);
                if (!userHasPermission) {
                    response.statusCode = 401;
                    response.message = strings.api.unauthorized;
                    return res.status(response.statusCode).send(response);
                }

                next();
            } catch (err) {
                response.statusCode = 500;
                response.message = strings.api.serverError;
                return res.status(response.statusCode).send(response);
            }
        }
    };

}

export default makeAuthorizationMiddleware;