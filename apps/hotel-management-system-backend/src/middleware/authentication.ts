import {ApiResponse} from "@hotel-management-system/models";
import config from "../config";
const jwt = require('jsonwebtoken');
const authentication = (req, res, next) => {
    // check if the request has a jwt token
    if (!req.headers.authorization) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized",
            statusCode: 401,
            data: null
        } as ApiResponse)
    }

    // verify the jwt token in Authorization Bearer header
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized",
                statusCode: 401,
                data: null
            } as ApiResponse)
        }

        // add the user id to the request
        req.userId = decoded.userId;
        req.userRoleId = decoded.roleId;
        next();
    })
}

export default authentication;