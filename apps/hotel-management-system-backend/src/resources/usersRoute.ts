import express from 'express';
import {getUsers, getUserById, createUser, deleteUser, getUserByUsername, checkUserExists} from '../database/users';
import {ApiResponse} from "@hotel-management-system/models";
import {validateRequestBody} from "../util/bodyValidator";

const router = express.Router();

router.get('/', (req, res) => {
    // return the list of users
    getUsers.then(users => {
        res.send(users);
    }).catch(err => {
        res.sendStatus(500);
    })
});

router.get('/:userId', (req, res) => {
    // return a single user by userId
    const userId = parseInt(req.params.userId);
    getUserById(userId).then(user => {
        res.send(user);
    }).catch(err => {
        res.sendStatus(404);
    })
});

router.post('/', (req, res) => {
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
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        hash.update(user.passwordSalt + user.password);
        user.password = hash.digest('hex');

        return createUser(user)
    }).then(user => {
        // construct the response
        response.success = true;
        response.statusCode = 201;
        response.message = "User created";
        response.data = user;
    }).catch(err => {

        // construct the response depending on the error type
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

router.delete('/:userId', (req, res) => {
    // delete a user by userId
    const userId = parseInt(req.params.userId);
    deleteUser(userId).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.sendStatus(404);
    })
})

export default router;