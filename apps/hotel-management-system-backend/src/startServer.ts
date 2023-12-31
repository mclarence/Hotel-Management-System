import {expressLogger, logger} from "./logger";
import createDatabase from "./database/db";
import express, {Express} from "express";
import makeUsersRoute from "./resources/usersRoute";
import {makeRoomsRoute} from "./resources/roomsRoute";
import path from "path";
import {ApiResponse, Role, ServerConfig, User,} from "@hotel-management-system/models";
import makeUsersDAO, {IUsersDAO} from "./database/users";
import makeRolesDAO, {IRolesDAO} from "./database/roles";
import makeTokenRevocationListDAO from "./database/tokens";
import makeAuthenticationMiddleware from "./middleware/authentication";
import makeAuthorizationMiddleware from "./middleware/authorization";
import * as process from "process";

// hash the password
import hashPassword from "./util/hashPassword";
import makeRolesRoute from "./resources/rolesRoute";
import makeLogsRoute from "./resources/logsRoute";
import makeLogsDAO from "./database/logs";
import makeGuestDAO from "./database/guests";
import makeGuestsRoute from "./resources/guestsRoute";
import {makeReservationDAO} from "./database/reservations";
import {makeReservationsRoute} from "./resources/reservationsRoute";
import {makeRoomsDAO} from "./database/rooms";
import {makePaymentMethodsDAO} from "./database/paymentMethods";
import {makePaymentMethodRoute} from "./resources/paymentMethodRoute";
import {makeTransactionsDAO} from "./database/transaction";
import {makeTransactionsRoute} from "./resources/transactionsRoute";
import {makeNotesDAO} from "./database/calendar";
import {makeCalendarRoute} from "./resources/calendarRoute";
import {makeTicketsDAO} from "./database/tickets";
import {makeTicketsRoute} from "./resources/ticketsRoute";
import {makeEventLogger} from "./util/logEvent";
import sendResponse from "./util/sendResponse";
import strings from "./util/strings";
import {makeGuestServiceOrderDAO} from "./database/guestServiceOrders";
import {makeGuestServiceDAO} from "./database/guestService";
import makeGuestServicesRoute from "./resources/guestServiceRoute";
import makeGuestServiceOrdersRoute from "./resources/guestServiceOrderRoute";

const createDefaultRoleAndAdmin = async (
    rolesDAO: IRolesDAO,
    usersDAO: IUsersDAO
) => {
    const DEFAULT_ROLE_ID = 1;
    const DEFAULT_UID = 1;
    const {checkRoleExists, addRole} = rolesDAO;

    const superAdminRoleExists = await checkRoleExists(DEFAULT_ROLE_ID);

    if (!superAdminRoleExists) {
        const superAdminRole: Role = {
            roleId: DEFAULT_ROLE_ID,
            name: "Super Admin",
            permissionData: ["*"],
        };

        await addRole(superAdminRole)
            .then(() => {
                logger.info("Created default role");
            })
            .catch((err: any) => {
                logger.fatal("Failed to create default role");
                logger.fatal(err);
                process.exit(1);
            });
    }

    const adminUserExists = await usersDAO.checkUserExists("admin");

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
            roleId: DEFAULT_ROLE_ID,
        };

        // generate a random password salt
        user.passwordSalt =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        user.password = hashPassword(user.password, user.passwordSalt);

        await usersDAO
            .createUser(user)
            .then(() => {
                logger.info("Created default user");
            })
            .catch((err: any) => {
                logger.fatal("Failed to create default user");
                logger.fatal(err);
                process.exit(1);
            });
    }
};

interface IServer {
    app: Express;
    start: () => void;
}

const startServer = async (serverOptions: ServerConfig): Promise<IServer> => {
    logger.info("Starting server");

    // Create the database
    const db = createDatabase(serverOptions);

    // Test the connection
    await db
        .testConnection()
        .then(() => {
            return db.createTables();
        })
        .catch((err: any) => {
            logger.fatal("Failed to connect to database");
            logger.fatal(err);
            process.exit(1);
        });

    /**
     * Initialize DAOs
     */
    const usersDAO = makeUsersDAO(db.db)
    const rolesDAO = makeRolesDAO(db.db)
    const logsDAO = makeLogsDAO(db.db)
    const tokenRevocationListDAO = makeTokenRevocationListDAO(db.db)
    const calendarDAO = makeNotesDAO(db.db)
    const guestsDAO = makeGuestDAO(db.db);
    const reservationsDAO = makeReservationDAO(db.db);
    const roomsDAO = makeRoomsDAO(db.db);
    const paymentMethodsDAO = makePaymentMethodsDAO(db.db)
    const transactionsDAO = makeTransactionsDAO(db.db)
    const ticketsDAO = makeTicketsDAO(db.db)
    const guestServiceOrdersDAO = makeGuestServiceOrderDAO(db.db)
    const guestServicesDAO = makeGuestServiceDAO(db.db)
    const eventLogger = makeEventLogger(logsDAO)
    await createDefaultRoleAndAdmin(rolesDAO, usersDAO);

    /**
     * Initialize middleware
     */
    const authenticationMiddleware = makeAuthenticationMiddleware(
        serverOptions.jwt.secret,
        tokenRevocationListDAO
    );

    const authorizationMiddleware = makeAuthorizationMiddleware(rolesDAO);

    const app = express();

    app.use(express.json());
    app.use(expressLogger);

    /**
     * Initialize routes
     */
    const usersRoute = makeUsersRoute(
        usersDAO,
        rolesDAO,
        tokenRevocationListDAO,
        authenticationMiddleware,
        authorizationMiddleware,
        eventLogger,
        serverOptions.jwt.secret
    );

    const rolesRoute = makeRolesRoute(
        rolesDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    );

    const guestsRoute = makeGuestsRoute(
        guestsDAO,
        reservationsDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    );

    const reservationsRoute = makeReservationsRoute(
        reservationsDAO,
        guestsDAO,
        roomsDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    );

    const roomsRoute = makeRoomsRoute(
        roomsDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    );

    const paymentMethodsRoute = makePaymentMethodRoute(
        paymentMethodsDAO,
        guestsDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    )

    const logsRoute = makeLogsRoute(
        logsDAO,
        authenticationMiddleware,
        authorizationMiddleware
    )

    const calendarRoute = makeCalendarRoute(
        calendarDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    );

    const transactionsRoute = makeTransactionsRoute(
        transactionsDAO,
        guestsDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    )

    const ticketsRoute = makeTicketsRoute(
        ticketsDAO,
        usersDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    )

    const guestServicesRoute = makeGuestServicesRoute(
        guestServicesDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    )

    const gestServicesOrderRoute = makeGuestServiceOrdersRoute(
        guestServiceOrdersDAO,
        reservationsDAO,
        guestServicesDAO,
        eventLogger,
        authenticationMiddleware,
        authorizationMiddleware
    )

    /**
     * Initialize routes
     */
    app.use("/api/users", usersRoute.router);
    app.use("/api/roles", rolesRoute.router);
    app.use("/api/rooms", roomsRoute.router);
    app.use("/api/logs", logsRoute.router);
    app.use("/api/calendar", calendarRoute.router);
    app.use("/api/rooms", roomsRoute.router);
    app.use("/api/guests", guestsRoute.router);
    app.use("/api/reservations", reservationsRoute.router);
    app.use("/api/payment-methods", paymentMethodsRoute.router);
    app.use("/api/transactions", transactionsRoute.router);
    app.use("/api/tickets", ticketsRoute.router);
    app.use("/api/guest-services", guestServicesRoute.router);
    app.use("/api/guest-service-orders", gestServicesOrderRoute.router);
    app.use(express.static(path.join(__dirname, "assets")));

    // catch all errors
    app.use((err: any, req, res, next) => {
        if ("body" in err && err.status === 400 && err instanceof SyntaxError) {
            res.status(400).send({
                success: false,
                message: "Invalid request body",
                statusCode: 400,
                data: err.message,
            } as ApiResponse<string>);
        } else {
             return sendResponse<any>(res, {
                success: false,
                message: strings.api.generic.error,
                statusCode: 500,
                data: err.message,
            })
        }
    });

    app.get("/api", (req, res) => {
        res.send({message: "Welcome to hotel-management-system-backend!"});
    });

    // serve react app from assets folder
    app.get("*", function (req, res) {
        res.sendFile("index.html", {root: path.join(__dirname, "assets")});
    });

    const start = () => {
        const port = serverOptions.server.port;
        const server = app.listen(port, () => {
            logger.info(`Listening at http://localhost:${port}/api`);
        });
        server.on("error", console.error);
    };

    return {
        app,
        start,
    };
};

export default startServer;
