import {ApiResponse} from "@hotel-management-system/models";
import hasPermission from "../util/checkPermissions";
import strings from "../util/strings";

const authorization = (requiredPermission: string) => {
    const response: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    }
    return (req, res, next) => {
        if (req.userRoleId === undefined) {
            response.statusCode = 401;
            response.message = strings.api.unauthenticated;
            return res.status(response.statusCode).send(response);
        }

        hasPermission(requiredPermission, req.userRoleId).then(hasPermission => {
            if (!hasPermission) {
                response.statusCode = 401;
                response.message = strings.api.unauthorized
                return res.status(response.statusCode).send(response);
            }

            next();
        }).catch(err => {
            response.data = err;
            res.status(response.statusCode).send(response);
        })
    }
}

export default authorization