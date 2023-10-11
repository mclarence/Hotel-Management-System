import {ApiResponse} from "@hotel-management-system/models";
import strings from "../util/strings";
import {ITokenRevocationListDAO} from "../database/tokens";
import jwt from "jsonwebtoken";

export interface IAuthenticationMiddleware {
    (req: any, res: any, next: any): void
}

/**
 * Authentication middleware, handles jwt token verification
 * @param jwtSecret - jwt secret
 * @param tokenRevocationListDAO - token revocation list DAO
 */
const makeAuthenticationMiddleware = (jwtSecret: string, tokenRevocationListDAO: ITokenRevocationListDAO): IAuthenticationMiddleware => {

    const {
        checkTokenRevoked
    } = tokenRevocationListDAO

    return async (req: any, res: any, next: any) => {
        // check if the request has a jwt token
        if (!req.headers.authorization) {
            return res.status(401).send({
                success: false,
                message: strings.api.users.unauthenticated,
                statusCode: 401,
                data: null
            } as ApiResponse<null>)
        }

        // verify the jwt token in Authorization Bearer header
        const token = req.headers.authorization.split(' ')[1];

        // check if the token is in the token revocation list
        const tokenRevoked = await checkTokenRevoked(token)

        // if the token is in the token revocation list, return 401
        if (tokenRevoked) {
            return res.status(401).send({
                success: false,
                message: strings.api.users.invalidToken,
                statusCode: 401,
                data: null
            } as ApiResponse<null>)
        }


        // verify the token
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: strings.api.users.invalidToken,
                    statusCode: 401,
                    data: null
                } as ApiResponse<null>)
            }
            // add the user id to the request
            req.userId = decoded.userId;
            req.userRoleId = decoded.roleId;

            // authentication successful, continue
            next();
        })
    }
}

export default makeAuthenticationMiddleware;