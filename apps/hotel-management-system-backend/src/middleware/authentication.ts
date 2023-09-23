import {ApiResponse} from "@hotel-management-system/models";
import config from "../config";
import strings from "../util/strings";
import {checkTokenRevoked} from "../database/tokens";

const jwt = require('jsonwebtoken');
const authentication = (req: any, res: any, next: any) => {
    // check if the request has a jwt token
    if (!req.headers.authorization) {
        return res.status(401).send({
            success: false,
            message: strings.api.unauthenticated,
            statusCode: 401,
            data: null
        } as ApiResponse<null>)
    }

    // verify the jwt token in Authorization Bearer header
    const token = req.headers.authorization.split(' ')[1];

    // check if the token is in the token revocation list
    checkTokenRevoked(token)
        .then((isRevoked: boolean) => {
            if (isRevoked) {
                // if the token is revoked, return 401
                return res.status(401).send({
                    success: false,
                    message: strings.api.tokenInvalid,
                    statusCode: 401,
                    data: null
                } as ApiResponse<null>)
            }
        })
        .then(() => {
            // if we get to this point, the token is not revoked, verify the token.
            jwt.verify(token, config.jwt.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: strings.api.tokenInvalid,
                        statusCode: 401,
                        data: null
                    } as ApiResponse<null>)
                }
                // add the user id to the request
                req.userId = decoded.userId;
                req.userRoleId = decoded.roleId;
                next();
            })
        })


}

export default authentication;