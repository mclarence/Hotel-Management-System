import express from 'express';
import {IUsersDAO} from "../database/users";
import {ApiResponse, User} from "@hotel-management-system/models";
import {validateRequestBody} from "../util/bodyValidator";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import {IRolesDAO} from "../database/roles";
import strings from "../util/strings";
import {ITokenRevocationListDAO} from "../database/tokens";
import hashPassword from "../util/hashPassword";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {logger} from "../logger";

interface UsersRoute {
    router: express.Router
}

const makeUsersRoute = (
    usersDAO: IUsersDAO,
    rolesDAO: IRolesDAO,
    tokenRevocationListDAO: ITokenRevocationListDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
    jwtSecret: string
): UsersRoute => {
    const router = express.Router();

    const {
        getUsers,
        getUserById,
        getUserByUsername,
        createUser,
        checkUserExists,
        deleteUser,
        updateUser
    } = usersDAO

    const {
        checkRoleExists
    } = rolesDAO

    const {
        revokeToken
    } = tokenRevocationListDAO

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
            response.message = "UsersPage retrieved";
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

            const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            user.passwordSalt = salt;
            user.password = hashPassword(user.password, salt)

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
        }).catch(() => {
            res.sendStatus(404);
        })
    })

    /**
     * HTTP POST - /api/users/login
     * Login a user
     */
    router.post('/login', async (req, res) => {
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
                username: user.username,
                tokenUUID: crypto.randomBytes(16).toString('hex')
            }, jwtSecret, {
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
            return res.status(response.statusCode).send(response);
        })
    })

    /**
     * HTTP POST - /api/users/logout
     * Logout a user by revoking the token.
     */
    router.post('/logout', authentication, (req, res) => {
        const response: ApiResponse<null> = {
            success: false,
            statusCode: 500,
            message: strings.api.serverError,
            data: null
        }

        // get token from authorization bearer header
        const token = req.headers.authorization?.split(' ')[1];

        revokeToken(token).then(() => {
            response.success = true;
            response.statusCode = 200;
            response.message = strings.api.loggedOut;
        }).catch(err => {
            response.message = err.message;
        }).finally(() => {
            res.status(response.statusCode).send(response);
        })
    })

    /**
     * HTTP PATCH - /api/users/:userId
     * Update user properties by userId
     */
    router.patch('/:userId', authentication, authorization('users.write'), async (req, res) => {
        const response: ApiResponse<User | null> = {
            success: false,
            statusCode: 500,
            message: strings.api.serverError,
            data: null
        }

        let userId: number;
        try {
            userId = parseInt(req.params.userId);
        } catch {
            response.statusCode = 400;
            response.message = strings.api.invalidUserId;
            res.status(response.statusCode).send(response);
            return;
        }

        // check if the request body is empty or contains fields that do not exist on the user object
        const allowedFields = ['username', 'password', 'firstName', 'lastName', 'email', 'phoneNumber', 'position', 'roleId'];
        const requestBody = req.body;

        // check if the body contains any fields that are not allowed
        for (const field in requestBody) {
            if (!allowedFields.includes(field)) {
                response.statusCode = 400;
                response.message = strings.api.invalidField(field);
                res.status(response.statusCode).send(response);
                return;
            }
        }

        getUserById(userId).then((user) => {
            if (user === null) {
                return Promise.reject({
                    type: 'userNotFound',
                    message: strings.api.userIdNotFound(userId)
                })
            }

            return user;
        })
            .then(async (user) => {
                // check if the username is already taken
                if (requestBody.username !== undefined) {
                    await checkUserExists(requestBody.username).then((exists) => {
                        if (exists) {
                            return Promise.reject({
                                type: 'userExists',
                                message: strings.api.userConflict(requestBody.username)
                            })
                        }
                    })
                }

                // check if the role id is valid
                if (requestBody.roleId !== undefined) {
                    await checkRoleExists(requestBody.roleId).then((exists) => {
                        if (!exists) {
                            return Promise.reject({
                                type: 'invalidRoleId',
                                message: strings.api.roleIdNotFound(requestBody.roleId)
                            })
                        }
                    })
                }

                return user;

            })
            .then((user) => {
                const updatedUser = {
                    ...user,
                    ...requestBody
                }

                // hash the password if it is defined
                if (requestBody.password !== undefined) {
                    const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    updatedUser.passwordSalt = salt;
                    updatedUser.password = hashPassword(requestBody.password, salt)
                }

                return updateUser(updatedUser);

            })
            .then((user) => {
                response.success = true;
                response.statusCode = 200;
                response.message = strings.api.success;
                response.data = user;
            })
            .catch(err => {
                switch (err.type) {
                    case 'userNotFound':
                        response.statusCode = 404;
                        response.message = err.message;
                        break;
                    case 'userExists':
                        response.statusCode = 409;
                        response.message = err.message;
                        break;
                    case 'invalidRoleId':
                        response.statusCode = 400;
                        response.message = err.message;
                        break;
                    default:
                        response.data = err;
                }
            })
            .finally(() => {
                res.status(response.statusCode).send(response);
            })

    })

    return {
        router
    }

}


export default makeUsersRoute;

