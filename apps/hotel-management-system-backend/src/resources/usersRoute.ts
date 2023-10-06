import express from 'express';
import {IUsersDAO} from "../database/users";
import {User} from "@hotel-management-system/models";
import {IAuthenticationMiddleware} from "../middleware/authentication";
import {IAuthorizationMiddleware} from "../middleware/authorization";
import {IRolesDAO} from "../database/roles";
import strings from "../util/strings";
import {ITokenRevocationListDAO} from "../database/tokens";
import hashPassword from "../util/hashPassword";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendResponse from "../util/sendResponse";
import {StatusCodes} from "http-status-codes";
import Joi from "joi";
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
        checkUserExistsById,
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
    router.get('/', authentication, authorization('users.read'), async (req: any, res) => {
        try {
            const users = await getUsers();
            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: users
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }

    });

    router.get('/me', authentication, async (req: any, res) => {
        try {
            const user = await getUserById(req.userId);

            // if the user is null, return 404
            if (user === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.userIdNotFound(req.userId),
                    data: null
                })
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: user
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * HTTP GET - /api/users/:userId
     * Get a user by id
     * Requires users.read permission
     */
    router.get('/:userId', authentication, authorization('users.read'), async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);

            if (isNaN(userId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidUserId,
                    data: null
                })
            }

            const user = await getUserById(userId);

            // if the user is null, return 404
            if (user === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.userIdNotFound(userId),
                    data: null
                })
            }

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: user
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    });

    /**
     * HTTP POST - /api/users/add
     * Create a new user
     */
    router.post('/add', authentication, authorization('users.write'), async (req, res) => {
        try {

            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string().email().allow('', null).required(),
                phoneNumber: Joi.string().allow('', null).required(),
                position: Joi.string().allow('', null).required(),
                roleId: Joi.number().required()
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null
                })
            }

            if (await checkUserExists(req.body.username)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.CONFLICT,
                    message: strings.api.userConflict(req.body.username),
                    data: null
                })
            }

            if (!await checkRoleExists(req.body.roleId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.roleIdNotFound(req.body.roleId),
                    data: null
                })
            }

            const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const user: User = {
                // the userId is set to 0 because it is not known yet. It will be set by the createUser function, but since we're using
                // typescript, we need to set it to something.
                userId: 0,
                username: req.body.username,
                password: hashPassword(req.body.password, salt),
                passwordSalt: salt,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                position: req.body.position,
                roleId: req.body.roleId
            }


            await createUser(user);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.CREATED,
                message: strings.api.success,
                data: user
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }

    })


    /**
     * HTTP DELETE - /api/users/:userId
     * Delete a user by userId
     */
    router.delete('/:userId', authentication, authorization('users.delete'), async (req: express.Request, res) => {
        try {
            const userId = parseInt(req.params.userId);

            //check if the user is trying to delete themselves
            if (userId === req['userId']) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.cannotDeleteSelf,
                    data: null
                })
            }

            if (isNaN(userId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidUserId,
                    data: null
                })
            }

            // check if the user exists
            if (!await checkUserExistsById(userId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.userIdNotFound(userId),
                    data: null
                })
            }

            await deleteUser(userId);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: null
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }

    })

    /**
     * HTTP POST - /api/users/login
     * Login a user
     */
    router.post('/login', async (req, res) => {
        try {

            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null
                })
            }

            const user = await getUserByUsername(req.body.username);

            if (user === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.usernameNotFound(req.body.username),
                    data: null
                })
            }

            // hash the password from the request body with the password salt from the database
            const hashedPasswordFromRequest = hashPassword(req.body.password, user.passwordSalt);

            // check if the hashed password matches the password from the database
            if (hashedPasswordFromRequest !== user.password) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.UNAUTHORIZED,
                    message: strings.api.incorrectPassword,
                    data: null
                })
            }

            const jwtToken = jwt.sign({
                userId: user.userId,
                roleId: user.roleId,
                username: user.username,
                tokenUUID: crypto.randomBytes(16).toString('hex')
            }, jwtSecret, {
                expiresIn: '24h'
            })

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.loginSuccessful,
                data: {
                    jwt: jwtToken
                }
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * HTTP POST - /api/users/logout
     * Logout a user by revoking the token.
     */
    router.post('/logout', authentication, async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (token === undefined) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.tokenInvalid,
                    data: null
                })
            }

            await revokeToken(token);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.loggedOut,
                data: null
            })
        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }
    })

    /**
     * HTTP PATCH - /api/users/:userId
     * Update user properties by userId
     */
    router.patch('/:userId', authentication, authorization('users.write'), async (req, res) => {
        try {
            const userId = parseInt(req.params.userId);

            if (isNaN(userId)) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: strings.api.invalidUserId,
                    data: null
                })
            }

            const schema = Joi.object({
                username: Joi.string(),
                password: Joi.string().optional(),
                firstName: Joi.string(),
                lastName: Joi.string(),
                email: Joi.string().email().optional().allow(''),
                phoneNumber: Joi.string().optional().allow(''),
                position: Joi.string().optional().allow(''),
                roleId: Joi.number()
            })

            const {error} = schema.validate(req.body);

            if (error) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null
                })
            }

            const user = await getUserById(userId);

            if (user === null) {
                return sendResponse(res, {
                    success: false,
                    statusCode: StatusCodes.NOT_FOUND,
                    message: strings.api.userIdNotFound(userId),
                    data: null
                })
            }

            // check if the username is already taken
            if (req.body.username !== undefined) {
                if (req.body.username !== user.username) {
                    if (await checkUserExists(req.body.username)) {
                        return sendResponse(res, {
                            success: false,
                            statusCode: StatusCodes.CONFLICT,
                            message: strings.api.userConflict(req.body.username),
                            data: null
                        })
                    }
                }
            }

            // check if the role id is valid
            if (req.body.roleId !== undefined) {
                if (req.body.roleId !== user.roleId) {
                    if (!await checkRoleExists(req.body.roleId)) {
                        return sendResponse(res, {
                            success: false,
                            statusCode: StatusCodes.BAD_REQUEST,
                            message: strings.api.roleIdNotFound(req.body.roleId),
                            data: null
                        })
                    }
                }
            }

            const updatedUser = {
                ...user,
                ...req.body
            }

            // hash the password if it is defined
            if (req.body.password !== undefined) {
                const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                updatedUser.passwordSalt = salt;
                updatedUser.password = hashPassword(req.body.password, salt)
            }

            await updateUser(updatedUser);

            return sendResponse(res, {
                success: true,
                statusCode: StatusCodes.OK,
                message: strings.api.success,
                data: updatedUser
            })

        } catch (e) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings.api.serverError,
                data: e
            })
        }

    })

    return {
        router
    }

}


export default makeUsersRoute;

