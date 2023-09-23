import express from 'express';
import {checkUserExists, createUser, deleteUser, getUserById, getUserByUsername, getUsers} from '../database/users';
import {ApiResponse} from "@hotel-management-system/models";
import {validateRequestBody} from "../util/bodyValidator";
import config from "../config";
import authentication from "../middleware/authentication";
import authorization from "../middleware/authorization";
import {checkRoleExists} from "../database/roles";
import strings from "../util/strings";
import {revokeToken} from "../database/tokens";

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * HTTP GET - /api/users
 * Get all users
 * Requires users.read permission
 */
router.get('/', authentication, authorization('users.read'), (req: any, res) => {

    const response = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    } as ApiResponse<any>;

    getUsers().then(users => {
        response.success = true;
        response.statusCode = 200;
        response.message = "Users retrieved";
        response.data = users;
    }).catch(err => {
        response.data = err;
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
});

router.get('/me', authentication, (req: any, res) => {
    const response = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    } as ApiResponse<any>;

    getUserById(req.userId).then(user => {
        if (user === null) {
            return Promise.reject({
                type: 'userNotFound',
                message: `User with id ${req.userId} not found`
            })
        }

        response.success = true;
        response.statusCode = 200;
        response.message = "User retrieved";
        response.data = user;
    }).catch(err => {
        switch (err.type) {
            case 'userNotFound':
                response.statusCode = 404;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            default:
                response.data = err;
        }
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
})

/**
 * HTTP GET - /api/users/:userId
 * Get a user by id
 * Requires users.read permission
 */
router.get('/:userId', authentication, authorization('users.read'), (req, res) => {
    const response = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    } as ApiResponse<any>;

    let userId: number;

    try {
        userId = parseInt(req.params.userId);
    } catch (err) {
        response.statusCode = 400;
        response.message = strings.api.invalidUserId;
        res.status(response.statusCode).send(response);
        return;
    }

    getUserById(userId).then(user => {
        if (user === null) {
            return Promise.reject({
                type: 'userNotFound',
                message: strings.api.userIdNotFound(userId)
            })
        }
        response.success = true;
        response.statusCode = 200;
        response.message = strings.api.success;
        response.data = user;
    }).catch(err => {
        switch (err.type) {
            case 'userNotFound':
                response.statusCode = 404;
                response.message = err.message;
                break;
            default:
                response.data = err;
        }
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
});

/**
 * HTTP POST - /api/users/add
 * Create a new user
 */
router.post('/add', authentication, authorization('users.write'), (req, res) => {
    const response = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    } as ApiResponse<any>;
    const requiredFields = ['username', 'password', 'firstName', 'lastName', 'email', 'phoneNumber', 'position', 'roleId'];

    validateRequestBody(req.body, requiredFields).then(() => {
        // check if the user with the same username exists
        return checkUserExists(req.body.username)
    }).then((exists) => {

        // if the user exists, reject the promise, otherwise continue
        if (exists) {
            return Promise.reject({
                type: 'userExists',
                message: strings.api.userConflict(req.body.username)
            })
        }

        // check if the role id is valid
        return checkRoleExists(req.body.roleId)
    }).then((exists) => {
        if (!exists) {
            return Promise.reject({
                type: 'invalidRoleId',
                message: strings.api.roleIdNotFound(req.body.roleId)
            })
        }
    }).then(() => {
        // create a new user
        const user = req.body;

        // generate a random password salt
        user.passwordSalt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // hash the password
        const hash = crypto.createHash('sha256');
        hash.update(user.passwordSalt + user.password);
        user.password = hash.digest('hex');

        return createUser(user)
    }).then(user => {
        // check if the user id is defined
        if (user.userId === undefined) {
            return Promise.reject("Creating the user did not return the user id")
        }

        // construct the response
        response.success = true;
        response.statusCode = 201;
        response.message = strings.api.success;
        response.data = user;
    }).catch(err => {

        // construct the error response depending on the error type
        switch (err.type) {
            case 'missingFields':
                response.statusCode = 400;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            case 'userExists':
                response.statusCode = 409;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            case 'unauthorized':
                response.statusCode = 401;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            case 'invalidRoleId':
                response.statusCode = 400;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            default:
                response.data = err;
        }
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
})


/**
 * HTTP DELETE - /api/users/:userId
 * Delete a user by userId
 */
router.delete('/:userId', authentication, authorization('users.delete'), (req, res) => {
    const response = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    } as ApiResponse<any>;
    // delete a user by userId
    const userId = parseInt(req.params.userId);

    deleteUser(userId).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(404);
    })
})

router.post('/login', (req, res) => {
    const response = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    } as ApiResponse<any>;

    const requiredFields = ['username', 'password'];

    validateRequestBody(req.body, requiredFields).then(() => {
        return getUserByUsername(req.body.username);
    }).then(user => {
        if (user === null) {
            return Promise.reject({
                type: 'userNotFound',
                message: `User with username ${req.body.username} not found`
            })
        }
        return user;
    }).then(user => {
        // hash the password from the request body with the password salt from the database
        const hash = crypto.createHash('sha256');
        hash.update(user.passwordSalt + req.body.password);
        const hashedPassword = hash.digest('hex');

        // check if the hashed password matches the password from the database
        if (hashedPassword !== user.password) {
            return Promise.reject({
                type: 'incorrectPassword',
                message: "Incorrect password"
            })
        }

        return user;
    }).then((user) => {
        const jwtToken = jwt.sign({
            userId: user.userId,
            roleId: user.roleId,
            username: user.username
        }, config.jwt.secret, {
            expiresIn: '24h'
        })

        response.success = true;
        response.statusCode = 200;
        response.message = "Login successful";
        response.data = {
            jwt: jwtToken
        }
    }).catch(err => {
        switch (err.type) {
            case 'missingFields':
                response.statusCode = 400;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            case 'userNotFound':
                response.statusCode = 404;
                response.message = err.message;
                response.success = false;
                response.data = null;
                break;
            case 'incorrectPassword':
                response.statusCode = 401;
                response.message = err.message;
                response.success = false;
                response.data = null;
        }
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
})

router.post('/logout', authentication , (req, res) => {
    const response: ApiResponse<null> = {
        success: false,
        statusCode: 500,
        message: strings.api.serverError,
        data: null
    }

    const requiredFields = ['token'];

    validateRequestBody(req.body, requiredFields).then(() => {
        return revokeToken(req.body.token);
    }).then(() => {
        response.success = true;
        response.statusCode = 200;
        response.message = strings.api.loggedOut;
    }).catch(err => {
        response.message = err.message;
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
})


export default router;

