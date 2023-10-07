import {expressLogger, logger} from "./logger";
import createDatabase from "./database/db";
import express, {Express} from "express";
import makeUsersRoute from "./resources/usersRoute";
import roomsRouter from "./resources/roomsRoute";
import path from "path";
import {ApiResponse, Role, ServerConfig, User} from "@hotel-management-system/models";
import makeUsersDAO, {IUsersDAO} from "./database/users";
import makeRolesDAO, {IRolesDAO} from "./database/roles";
import makeTokenRevocationListDAO from "./database/tokens";
import makeAuthenticationMiddleware from "./middleware/authentication";
import makeAuthorizationMiddleware from "./middleware/authorization";
import * as process from "process";


// hash the password
import crypto from "crypto";
import hashPassword from "./util/hashPassword";
import makeRolesRoute from "./resources/rolesRoute";
import makeGuestDAO from "./database/guests";
import makeGuestsRoute from "./resources/guestsRoute";

const createDefaultRoleAndAdmin = async (rolesDAO: IRolesDAO, usersDAO: IUsersDAO) => {
    const DEFAULT_ROLE_ID = 1;
    const DEFAULT_UID = 1;
    const {
        checkRoleExists,
        addRole
    } = rolesDAO

    const superAdminRoleExists = await checkRoleExists(DEFAULT_ROLE_ID)

    if (!superAdminRoleExists) {
        const superAdminRole: Role = {
            roleId: DEFAULT_ROLE_ID,
            name: "Super Admin",
            permissionData: ["*"]
        }

        await addRole(superAdminRole)
            .then(() => {
                logger.info("Created default role");
            })
            .catch((err: any) => {
                logger.fatal("Failed to create default role");
                logger.fatal(err);
                process.exit(1);
            })
    }

    const adminUserExists = await usersDAO.checkUserExists("admin")

    if (!adminUserExists) {
        const user: User = {
            email: "admin@example.com",
            firstName: "super",
            lastName: "admin",
            phoneNumber: "",
            position: "Admin",
            userId: DEFAULT_UID,
            username: "admin",
            password: "admin",
            passwordSalt: "",
            roleId: DEFAULT_ROLE_ID

        }

        // generate a random password salt
        user.passwordSalt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.password = hashPassword(user.password, user.passwordSalt)

        await usersDAO.createUser(user)
            .then(() => {
                logger.info("Created default user");
            })
            .catch((err: any) => {
                    logger.fatal("Failed to create default user");
                    logger.fatal(err);
                    process.exit(1);
                }
            )
    }
}

interface IServer {
    app: Express,
    start: () => void
}

const startServer = async (serverOptions: ServerConfig): Promise<IServer> => {
    logger.info("Starting server");

    const db = createDatabase(serverOptions);

    await db.testConnection()
        .then(() => {
            return db.createTables();
        }).catch((err: any) => {
            logger.fatal("Failed to connect to database");
            logger.fatal(err);
            process.exit(1);
        })

    const usersDAO = makeUsersDAO(db.db)
    const rolesDAO = makeRolesDAO(db.db)
    const guestsDAO = makeGuestDAO(db.db)
    const tokenRevocationListDAO = makeTokenRevocationListDAO(db.db)

    await createDefaultRoleAndAdmin(rolesDAO, usersDAO)

    const authenticationMiddleware = makeAuthenticationMiddleware(
        serverOptions.jwt.secret,
        tokenRevocationListDAO
    )

    const authorizationMiddleware = makeAuthorizationMiddleware(rolesDAO)

    const app = express();

    app.use(express.json())
    app.use(expressLogger);

    const usersRoute = makeUsersRoute(
        usersDAO,
        rolesDAO,
        tokenRevocationListDAO,
        authenticationMiddleware,
        authorizationMiddleware,
        serverOptions.jwt.secret,
    )

    const rolesRoute = makeRolesRoute(
        rolesDAO,
        authenticationMiddleware,
        authorizationMiddleware
    )

    const guestsRoute = makeGuestsRoute(
        guestsDAO,
        authenticationMiddleware,
        authorizationMiddleware
    )

    app.use("/api/users", usersRoute.router);
    app.use("/api/roles", rolesRoute.router);
    app.use("/api/rooms", roomsRouter);
    app.use("/api/guests", guestsRoute.router);
    app.use(express.static(path.join(__dirname, 'assets')));

    // catch all errors
    app.use((err: any, req, res, next) => {
        if ('body' in err && err.status === 400 && err instanceof SyntaxError) {
            res.status(400).send({
                    success: false,
                    message: "Invalid request body",
                    statusCode: 400,
                    data: err.message
                } as ApiResponse<string>
            );
        }
        next();
    })

    app.get('/api', (req, res) => {
        res.send({message: 'Welcome to hotel-management-system-backend!'});
    });

    // serve react app from assets folder
    app.get('*', function (req, res) {
        res.sendFile('index.html', {root: path.join(__dirname, 'assets')});
    });

    const start = () => {
        const port = serverOptions.server.port
        const server = app.listen(port, () => {
            logger.info(`Listening at http://localhost:${port}/api`);
        });
        server.on('error', console.error);
    }

    return {
        app,
        start
    }
}


export default startServer;