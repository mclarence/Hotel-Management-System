import express from 'express';
import {getUsers, getUserById, createUser, deleteUser, getUserByUsername, checkUserExists} from '../database/users';
import {ApiResponse} from "@hotel-management-system/models";
import {validateRequestBody} from "../util/bodyValidator";
import config from "../config";
import authentication from "../middleware/authentication";
import hasPermission from "../util/checkPermissions";

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * HTTP GET - /api/users
 * Get all users
 */
router.get('/', authentication, (req: any, res) => {

    const response: ApiResponse = {
        success: false,
        statusCode: 500,
        message: "Internal server error",
        data: null
    }

    hasPermission('users.read', req.userRoleId).then(hasPermission => {
        if (!hasPermission) {
            return Promise.reject({
                type: 'unauthorized',
                message: "Unauthorized"
            })
        }

        return getUsers();
    }).then(users => {
        response.success = true;
        response.statusCode = 200;
        response.message = "Users retrieved";
        response.data = users;
    }).catch(err => {
        switch (err.type) {
            case 'unauthorized':
                response.statusCode = 401;
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
 * HTTP GET - /api/users/:userId
 * Get a user by id
 */
router.get('/:userId', (req, res) => {
    const response: ApiResponse = {
        success: false,
        statusCode: 500,
        message: "Internal server error",
        data: null
    }

    let userId: number;

    try {
        userId = parseInt(req.params.userId);
    } catch (err) {
        response.statusCode = 400;
        response.message = "Invalid user id";
        res.status(response.statusCode).send(response);
        return;
    }

    getUserById(userId).then(user => {
        if (user === null) {
            return Promise.reject({
                type: 'userNotFound',
                message: `User with id ${userId} not found`
            })
        }
        response.success = true;
        response.statusCode = 200;
        response.message = "User retrieved";
        response.data = user;
    }).catch(err => {
        response.statusCode = 404;
        response.message = err.message;
    }).finally(() => {
        res.status(response.statusCode).send(response);
    })
});

/**
 * HTTP POST - /api/users/add
 * Create a new user
 */
router.post('/add', (req, res) => {
    const response: ApiResponse = {
        success: false,
        statusCode: 500,
        message: "Internal server error",
        data: null
    }
    const requiredFields = ['username', 'password', 'firstName', 'lastName', 'email', 'phoneNumber', 'position', 'roleId'];

    // validate the request body
    validateRequestBody(req.body, requiredFields).then(() => {
        // check if the user with the same username exists
        return checkUserExists(req.body.username)
    }).then((exists) => {

        // if the user exists, reject the promise, otherwise continue
        if (exists) {
            return Promise.reject({
                type: 'userExists',
                message: `User with username ${req.body.username} already exists`
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
        response.message = "User created";
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
            default:
                response.statusCode = 500;
                response.message = "Internal server error";
                response.success = false;
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
router.delete('/:userId', (req, res) => {
    // delete a user by userId
    const userId = parseInt(req.params.userId);
    deleteUser(userId).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(404);
    })
})

router.post('/login', (req, res) => {
    const response: ApiResponse = {
        success: false,
        statusCode: 500,
        message: "Internal server error",
        data: null
    }

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
        }, config.jwt.secret)

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

export default router;

