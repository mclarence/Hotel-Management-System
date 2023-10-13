/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const minimist_1 = tslib_1.__importDefault(__webpack_require__(3));
const fs_1 = tslib_1.__importDefault(__webpack_require__(4));
const makeConfig = () => {
    let _config = {
        database: {
            database: null,
            host: null,
            password: null,
            port: 3333,
            user: null
        },
        jwt: {
            secret: null
        },
        server: {
            listenAddress: "",
            port: 0
        }
    };
    const loadFromFile = (pathToFile) => {
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync(pathToFile)) {
                reject(new Error("Config file does not exist"));
            }
            let configFile;
            try {
                configFile = JSON.parse(fs_1.default.readFileSync(pathToFile, 'utf8'));
            }
            catch (e) {
                reject(new Error("Config file is not valid json"));
            }
            const requiredFields = ['database', 'database.host', 'database.port', 'database.database', 'database.user', 'database.password', 'jwt.secret'];
            for (const field of requiredFields) {
                const fieldParts = field.split('.');
                let value = configFile;
                for (const part of fieldParts) {
                    if (value[part] === undefined) {
                        reject(new Error(`Config file is missing required field ${field}`));
                    }
                    value = value[part];
                }
            }
            if (configFile.server.listenAddress === undefined) {
                configFile.server.listenAddress = "127.0.0.1";
            }
            if (configFile.server.port === undefined) {
                configFile.server.port = 3333;
            }
            _config = configFile;
            resolve();
        });
    };
    const loadFromArgs = (args) => {
        return new Promise((resolve, reject) => {
            let ArgKeys;
            (function (ArgKeys) {
                ArgKeys["LISTEN_ADDRESS"] = "listenAddress";
                ArgKeys["LISTEN_PORT"] = "listenPort";
                ArgKeys["DATABASE_HOST"] = "database-host";
                ArgKeys["DATABASE_PORT"] = "database-port";
                ArgKeys["DATABASE_NAME"] = "database-name";
                ArgKeys["DATABASE_USER"] = "database-user";
                ArgKeys["DATABASE_PASSWORD"] = "database-password";
                ArgKeys["JWT_SECRET"] = "jwt-secret";
            })(ArgKeys || (ArgKeys = {}));
            const requriedArgs = [ArgKeys.DATABASE_HOST, ArgKeys.DATABASE_PORT, ArgKeys.DATABASE_NAME, ArgKeys.DATABASE_USER, ArgKeys.DATABASE_PASSWORD, ArgKeys.JWT_SECRET];
            const parsedArgs = (0, minimist_1.default)(args, {
                //string: ['listenAddress', 'database-host', 'database-name', 'database-user', 'database-password', 'jwt-secret'],
                string: [ArgKeys.LISTEN_ADDRESS, ArgKeys.DATABASE_HOST, ArgKeys.DATABASE_NAME, ArgKeys.DATABASE_USER, ArgKeys.DATABASE_PASSWORD, ArgKeys.JWT_SECRET]
            });
            for (const arg of requriedArgs) {
                if (parsedArgs[arg] === undefined) {
                    reject(new Error(`Missing required argument ${arg}`));
                }
            }
            _config.server.listenAddress = parsedArgs[ArgKeys.LISTEN_ADDRESS] || "127.0.0.1";
            _config.server.port = parsedArgs[ArgKeys.LISTEN_PORT] || 3333;
            _config.database.host = parsedArgs[ArgKeys.DATABASE_HOST];
            _config.database.port = parsedArgs[ArgKeys.DATABASE_PORT];
            _config.database.database = parsedArgs[ArgKeys.DATABASE_NAME];
            _config.database.user = parsedArgs[ArgKeys.DATABASE_USER];
            _config.database.password = parsedArgs[ArgKeys.DATABASE_PASSWORD];
            _config.jwt.secret = parsedArgs[ArgKeys.JWT_SECRET];
            resolve();
        });
    };
    return {
        getConfig: () => _config,
        loadFromFile,
        loadFromArgs,
    };
};
exports["default"] = makeConfig;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("minimist");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const logger_1 = __webpack_require__(6);
const db_1 = tslib_1.__importDefault(__webpack_require__(10));
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const usersRoute_1 = tslib_1.__importDefault(__webpack_require__(15));
const roomsRoute_1 = __webpack_require__(24);
const path_1 = tslib_1.__importDefault(__webpack_require__(43));
const users_1 = tslib_1.__importDefault(__webpack_require__(44));
const roles_1 = tslib_1.__importDefault(__webpack_require__(45));
const tokens_1 = tslib_1.__importDefault(__webpack_require__(46));
const authentication_1 = tslib_1.__importDefault(__webpack_require__(47));
const authorization_1 = tslib_1.__importDefault(__webpack_require__(48));
const process = tslib_1.__importStar(__webpack_require__(50));
// hash the password
const hashPassword_1 = tslib_1.__importDefault(__webpack_require__(17));
const rolesRoute_1 = tslib_1.__importDefault(__webpack_require__(51));
const logsRoute_1 = tslib_1.__importDefault(__webpack_require__(52));
const logs_1 = tslib_1.__importDefault(__webpack_require__(53));
const guests_1 = tslib_1.__importDefault(__webpack_require__(54));
const guestsRoute_1 = tslib_1.__importDefault(__webpack_require__(55));
const reservations_1 = __webpack_require__(56);
const reservationsRoute_1 = __webpack_require__(57);
const rooms_1 = __webpack_require__(61);
const paymentMethods_1 = __webpack_require__(62);
const paymentMethodRoute_1 = __webpack_require__(63);
const transaction_1 = __webpack_require__(65);
const transactionsRoute_1 = __webpack_require__(66);
const calendar_1 = __webpack_require__(67);
const calendarRoute_1 = __webpack_require__(68);
const tickets_1 = __webpack_require__(69);
const ticketsRoute_1 = __webpack_require__(70);
const logEvent_1 = __webpack_require__(71);
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const createDefaultRoleAndAdmin = (rolesDAO, usersDAO) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const DEFAULT_ROLE_ID = 1;
    const DEFAULT_UID = 1;
    const { checkRoleExists, addRole } = rolesDAO;
    const superAdminRoleExists = yield checkRoleExists(DEFAULT_ROLE_ID);
    if (!superAdminRoleExists) {
        const superAdminRole = {
            roleId: DEFAULT_ROLE_ID,
            name: "Super Admin",
            permissionData: ["*"],
        };
        yield addRole(superAdminRole)
            .then(() => {
            logger_1.logger.info("Created default role");
        })
            .catch((err) => {
            logger_1.logger.fatal("Failed to create default role");
            logger_1.logger.fatal(err);
            process.exit(1);
        });
    }
    const adminUserExists = yield usersDAO.checkUserExists("admin");
    if (!adminUserExists) {
        const user = {
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
        user.password = (0, hashPassword_1.default)(user.password, user.passwordSalt);
        yield usersDAO
            .createUser(user)
            .then(() => {
            logger_1.logger.info("Created default user");
        })
            .catch((err) => {
            logger_1.logger.fatal("Failed to create default user");
            logger_1.logger.fatal(err);
            process.exit(1);
        });
    }
});
const startServer = (serverOptions) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info("Starting server");
    const db = (0, db_1.default)(serverOptions);
    yield db
        .testConnection()
        .then(() => {
        return db.createTables();
    })
        .catch((err) => {
        logger_1.logger.fatal("Failed to connect to database");
        logger_1.logger.fatal(err);
        process.exit(1);
    });
    const usersDAO = (0, users_1.default)(db.db);
    const rolesDAO = (0, roles_1.default)(db.db);
    const logsDAO = (0, logs_1.default)(db.db);
    const eventLogger = (0, logEvent_1.makeEventLogger)(logsDAO);
    const tokenRevocationListDAO = (0, tokens_1.default)(db.db);
    const calendarDAO = (0, calendar_1.makeNotesDAO)(db.db);
    const guestsDAO = (0, guests_1.default)(db.db);
    const reservationsDAO = (0, reservations_1.makeReservationDAO)(db.db);
    const roomsDAO = (0, rooms_1.makeRoomsDAO)(db.db);
    const paymentMethodsDAO = (0, paymentMethods_1.makePaymentMethodsDAO)(db.db);
    const transactionsDAO = (0, transaction_1.makeTransactionsDAO)(db.db);
    const ticketsDAO = (0, tickets_1.makeTicketsDAO)(db.db);
    yield createDefaultRoleAndAdmin(rolesDAO, usersDAO);
    const authenticationMiddleware = (0, authentication_1.default)(serverOptions.jwt.secret, tokenRevocationListDAO);
    const authorizationMiddleware = (0, authorization_1.default)(rolesDAO);
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(logger_1.expressLogger);
    const usersRoute = (0, usersRoute_1.default)(usersDAO, rolesDAO, tokenRevocationListDAO, authenticationMiddleware, authorizationMiddleware, eventLogger, serverOptions.jwt.secret);
    const rolesRoute = (0, rolesRoute_1.default)(rolesDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const guestsRoute = (0, guestsRoute_1.default)(guestsDAO, reservationsDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const reservationsRoute = (0, reservationsRoute_1.makeReservationsRoute)(reservationsDAO, guestsDAO, roomsDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const roomsRoute = (0, roomsRoute_1.makeRoomsRoute)(roomsDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const paymentMethodsRoute = (0, paymentMethodRoute_1.makePaymentMethodRoute)(paymentMethodsDAO, guestsDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const logsRoute = (0, logsRoute_1.default)(logsDAO, authenticationMiddleware, authorizationMiddleware);
    const calendarRoute = (0, calendarRoute_1.makeCalendarRoute)(calendarDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const transactionsRoute = (0, transactionsRoute_1.makeTransactionsRoute)(transactionsDAO, guestsDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
    const ticketsRoute = (0, ticketsRoute_1.makeTicketsRoute)(ticketsDAO, usersDAO, eventLogger, authenticationMiddleware, authorizationMiddleware);
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
    app.use(express_1.default.static(path_1.default.join(__dirname, "assets")));
    // catch all errors
    app.use((err, req, res, next) => {
        if ("body" in err && err.status === 400 && err instanceof SyntaxError) {
            res.status(400).send({
                success: false,
                message: "Invalid request body",
                statusCode: 400,
                data: err.message,
            });
        }
        else {
            return (0, sendResponse_1.default)(res, {
                success: false,
                message: strings_1.default.api.generic.error,
                statusCode: 500,
                data: err.message,
            });
        }
    });
    app.get("/api", (req, res) => {
        res.send({ message: "Welcome to hotel-management-system-backend!" });
    });
    // serve react app from assets folder
    app.get("*", function (req, res) {
        res.sendFile("index.html", { root: path_1.default.join(__dirname, "assets") });
    });
    const start = () => {
        const port = serverOptions.server.port;
        const server = app.listen(port, () => {
            logger_1.logger.info(`Listening at http://localhost:${port}/api`);
        });
        server.on("error", console.error);
    };
    return {
        app,
        start,
    };
});
exports["default"] = startServer;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.expressLogger = exports.logger = void 0;
const tslib_1 = __webpack_require__(1);
// check if the environment is development and if so, import pino-pretty
const pino_1 = tslib_1.__importDefault(__webpack_require__(7));
const pino_http_1 = tslib_1.__importDefault(__webpack_require__(8));
const pino_pretty_1 = tslib_1.__importDefault(__webpack_require__(9));
let logger;
let expressLogger;
if (process.env.NODE_ENV === "development") {
    exports.logger = logger = (0, pino_1.default)((0, pino_pretty_1.default)());
    logger.level = "debug";
    exports.expressLogger = expressLogger = (0, pino_http_1.default)((0, pino_pretty_1.default)());
}
else {
    exports.logger = logger = (0, pino_1.default)();
    exports.expressLogger = expressLogger = (0, pino_http_1.default)();
    if (process.env["NODE_ENV"] === "test") {
        logger.level = 'silent';
        expressLogger.logger.level = 'silent';
    }
}


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("pino");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("pino-http");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("pino-pretty");

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const logger_1 = __webpack_require__(6);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const camelizeColumns_1 = __webpack_require__(12);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
/**
 * Create database
 * @param options - server options
 */
const createDatabase = (options) => {
    // disable warnings in test environment
    let noWarnings = false;
    if (process.env['NODE_ENV'] === 'test') {
        noWarnings = true;
    }
    // create the database object
    const pgp = (0, pg_promise_1.default)({
        receive(e) {
            (0, camelizeColumns_1.camelizeColumns)(e.data);
        },
        noWarnings: noWarnings
    });
    // create the database connection
    const db = pgp({
        host: options.database.host,
        port: options.database.port,
        database: options.database.database,
        user: options.database.user,
        password: options.database.password,
    });
    // test the database connection
    const testConnection = () => {
        return new Promise((resolve, reject) => {
            db.connect()
                .then((e) => {
                logger_1.logger.debug(`Connected to database ${e.client.connectionParameters.host}`);
                resolve();
            })
                .catch((err) => {
                logger_1.logger.fatal("Failed to connect to database");
                logger_1.logger.fatal(err);
                reject(err);
            });
        });
    };
    // create the tables
    const createTables = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.debug("Creating tables");
        yield db.none(queries_1.default.tables.createAll).then(() => {
            logger_1.logger.debug("Created tables");
        }).catch((err) => {
            logger_1.logger.fatal("Failed to create tables");
            logger_1.logger.fatal(err);
            process.exit(1);
        });
    });
    return {
        db,
        createTables,
        testConnection
    };
};
exports["default"] = createDatabase;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const queries = {
    tables: {
        createAll: `
            CREATE TABLE IF NOT EXISTS roles (
            role_id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            permission_data text[] NOT NULL
            );
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                password_salt VARCHAR(255) NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                role_id INTEGER NOT NULL,
                FOREIGN KEY (role_id) REFERENCES roles(role_id)
            );
            CREATE TABLE IF NOT EXISTS token_revocation_list (
                token_id SERIAL PRIMARY KEY,
                token VARCHAR(255) NOT NULL,
                revokedAt TIMESTAMP NOT NULL
            );
            CREATE TABLE IF NOT EXISTS logs (
                log_id SERIAL PRIMARY KEY,
                event_type VARCHAR(255) NOT NULL, 
                timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp,
                user_id INTEGER NOT NULL,
                description TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS calendar_notes(
                note_id SERIAL PRIMARY KEY,
                date TIMESTAMP NOT NULL,
                note VARCHAR(255)
            );
            CREATE TABLE IF NOT EXISTS guests (
                guest_id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS rooms (
                room_id SERIAL PRIMARY KEY,
                room_code VARCHAR(255) UNIQUE NOT NULL,
                price_per_night FLOAT NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS reservations (
                reservation_id SERIAL PRIMARY KEY,
                room_id INTEGER NOT NULL,
                guest_id INTEGER NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                check_in_date TIMESTAMP,
                check_out_date TIMESTAMP,
                reservation_status VARCHAR(255) NOT NULL,
                FOREIGN KEY (room_id) REFERENCES rooms(room_id),
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS payment_methods (
                payment_method_id SERIAL PRIMARY KEY,
                guest_id INTEGER NOT NULL,
                type VARCHAR(255) NOT NULL,
                card_number VARCHAR(255),
                card_cvv VARCHAR(255),
                card_expiration DATE,
                card_holder_name VARCHAR(255),
                bank_account_number VARCHAR(255),
                bank_bsb VARCHAR(255),
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS transaction (
                transaction_id SERIAL PRIMARY KEY,
                payment_method_id INTEGER NOT NULL,
                guest_id INTEGER NOT NULL,
                amount FLOAT NOT NULL,
                description VARCHAR(255) NOT NULL,
                date TIMESTAMP NOT NULL,
                FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS tickets (
                ticket_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL,
                date_opened TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS ticket_messages (
                ticket_message_id SERIAL PRIMARY KEY,
                ticket_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                message VARCHAR(255) NOT NULL,
                date_created TIMESTAMP NOT NULL,
                FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `,
    },
    tickets: {
        getTicketById: `
            SELECT * FROM tickets WHERE ticket_id = $1
        `,
        addTicket: `
            INSERT INTO tickets (user_id, title, description, status, date_opened)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateTicket: `
            UPDATE tickets
            SET user_id = $1, title = $2, description = $3, status = $4, date_opened = $5
            WHERE ticket_id = $6
            RETURNING *
        `,
        deleteTicket: `
            DELETE FROM tickets
            WHERE ticket_id = $1
        `,
        getAllTickets: `
            SELECT tickets.*, users.first_name as user_first_name, users.last_name as user_last_name FROM tickets
            INNER JOIN users ON tickets.user_id = users.user_id
        `,
        addCommentToTicket: `
            INSERT INTO ticket_messages (ticket_id, user_id, message, date_created)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        fetchTicketComments: `
            SELECT ticket_messages.*, users.first_name as user_first_name, users.last_name as user_last_name FROM ticket_messages
            INNER JOIN users ON ticket_messages.user_id = users.user_id
        `,
        checkTicketExistsById: `
            SELECT EXISTS(SELECT 1 FROM tickets WHERE ticket_id = $1)
        `,
        deleteTicketCommentsByTicketId: `
            DELETE FROM ticket_messages
            WHERE ticket_id = $1
        `,
    },
    roles: {
        checkRoleExistsByName: `
            SELECT EXISTS(SELECT 1 FROM roles WHERE name = $1)
        `,
        getRoleById: `
            SELECT * FROM roles WHERE role_id = $1
        `,
        checkRoleExists: `
            SELECT EXISTS(SELECT 1 FROM roles WHERE role_id = $1)
        `,
        addRole: `
            INSERT INTO roles (name, permission_data)
            VALUES ($1, $2)
            RETURNING *
        `,
        updateRole: `
            UPDATE roles
            SET name = $1, permission_data = $2
            WHERE role_id = $3
            RETURNING *
        `,
        getAllRoles: `
            SELECT * FROM roles
        `,
        getUsersWithRoles: `
            SELECT * FROM users WHERE role_id = $1
        `,
        deleteRole: `
            DELETE FROM roles
            WHERE role_id = $1
        `,
    },
    users: {
        getUserById: `
            SELECT * FROM users WHERE user_id = $1
        `,
        getUserByUsername: `
            SELECT * FROM users
            WHERE username = $1
        `,
        createUser: `
            INSERT INTO users (username, password, password_salt, first_name, last_name, email, phone_number, position, role_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING user_id
        `,
        updateUser: `
            UPDATE users
            SET username = $1, password = $2, password_salt = $3, first_name = $4, last_name = $5, email = $6, phone_number = $7, position = $8, role_id = $9
            WHERE user_id = $10
            RETURNING *
        `,
        deleteUser: `
            DELETE FROM users
            WHERE user_id = $1
        `,
        getAllUsers: `
            SELECT users.*, roles.name as role_name FROM users
            INNER JOIN roles ON users.role_id = roles.role_id
        `,
        searchUsers: `
            SELECT * FROM users WHERE first_name ILIKE '%$1#%' OR last_name ILIKE '%$1#%'
        `
    },
    tokenRevocationList: {
        revokeToken: `
            INSERT INTO token_revocation_list (token, revokedAt) VALUES ($1, $2)
        `,
        checkTokenRevoked: `
            SELECT * FROM token_revocation_list WHERE token = $1
        `,
    },
    logs: {
        addLog: `
            INSERT INTO logs (event_type, timestamp, user_id, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        getAllLogs: `
            SELECT * FROM logs
        `,
        deleteLog: `
        DELETE FROM logs
         WHERE log_id = $1
        `,
    },
    notes: {
        getNoteById: `
            SELECT * FROM calendar_notes WHERE DATE(date) = DATE($1);
        `,
        addNote: `
            INSERT INTO calendar_notes (date, note)
            VALUES ($1, $2)
            RETURNING *
        `,
        deleteNote: `
            DELETE FROM calendar_notes
            WHERE note_id = $1
        `,
        checkNoteExistsById: `
            SELECT EXISTS(SELECT 1 FROM calendar_notes WHERE note_id = $1)
        `,
        updateNote: `
            UPDATE calendar_notes
            SET note = $1
            WHERE note_id = $2
            RETURNING *
        `
    },
    guests: {
        getGuests: `
            SELECT * FROM guests
        `,
        getGuestById: `
            SELECT * FROM guests WHERE guest_id = $1
        `,
        addGuest: `
            INSERT INTO guests (first_name, last_name, email, phone_number, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateGuest: `
            UPDATE guests
            SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5
            WHERE guest_id = $6
            RETURNING *
        `,
        deleteGuest: `
            DELETE FROM guests
            WHERE guest_id = $1
        `,
        checkGuestExistsById: `
            SELECT EXISTS(SELECT 1 FROM guests WHERE guest_id = $1)
        `,
        searchGuests: `
            SELECT * FROM guests WHERE first_name || ' ' || last_name ILIKE '%$1#%';
        `,
    },
    reservations: {
        getReservations: `
            SELECT reservations.*, rooms.room_code, guests.first_name as guest_first_name, guests.last_name as guest_last_name FROM reservations
            INNER JOIN guests ON reservations.guest_id = guests.guest_id
            INNER JOIN rooms ON reservations.room_id = rooms.room_id
        `,
        getReservationById: `
            SELECT * FROM reservations WHERE reservation_id = $1
        `,
        addReservation: `
            INSERT INTO reservations (room_id, guest_id, start_date, end_date, reservation_status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateReservation: `
            UPDATE reservations
            SET room_id = $1, guest_id = $2, start_date = $3, end_date = $4, reservation_status = $5, check_in_date = $6, check_out_date = $7
            WHERE reservation_id = $8
            RETURNING *
        `,
        deleteReservation: `
            DELETE FROM reservations
            WHERE reservation_id = $1
        `,
        checkReservationExistsById: `
            SELECT EXISTS(SELECT 1 FROM reservations WHERE reservation_id = $1)
        `,
        searchReservations: `
            SELECT * FROM reservations WHERE start_date ILIKE '%$1#%' OR end_date ILIKE '%$1#%'
        `,
        getReservationsByGuestId: `
            SELECT * FROM reservations WHERE guest_id = $1        
        `,
        checkIfReservationIsAvailable: `
            SELECT EXISTS(
                SELECT 1 FROM reservations
                WHERE room_id = $1
                AND (start_date, end_date) OVERLAPS ($2, $3))
        `,
    },
    rooms: {
        getRooms: `
            SELECT * FROM rooms
        `,
        getRoomById: `
            SELECT * FROM rooms WHERE room_id = $1
        `,
        addRoom: `
            INSERT INTO rooms (room_code, price_per_night, description, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        updateRoom: `
            UPDATE rooms
            SET room_code = $1, price_per_night = $2, description = $3, status = $4
            WHERE room_id = $5
            RETURNING *
        `,
        deleteRoom: `
            DELETE FROM rooms
            WHERE room_id = $1
        `,
        checkRoomExistsById: `
            SELECT EXISTS(SELECT 1 FROM rooms WHERE room_id = $1)
        `,
        searchRooms: `
            SELECT * FROM rooms WHERE room_code ILIKE '%$1#%' OR description ILIKE '%$1#%'
        `,
        checkRoomExistsByRoomCode: `
            SELECT EXISTS(SELECT 1 FROM rooms WHERE room_code = $1)
        `,
        getStatusCount: `
        SELECT status, COUNT(*) AS count
            FROM rooms
            GROUP BY status
            ORDER BY status;
        `,
        getReservationsByRoomId: `
            SELECT * FROM reservations WHERE room_id = $1
        `,
    },
    paymentMethods: {
        getPaymentMethods: `
            SELECT * FROM payment_methods
        `,
        getPaymentMethodById: `
            SELECT * FROM payment_methods WHERE payment_method_id = $1
        `,
        getPaymentMethodsByGuestId: `
            SELECT * FROM payment_methods WHERE guest_id = $1
        `,
        addPaymentMethod: `
            INSERT INTO payment_methods (guest_id, type, card_number, card_cvv, card_expiration, card_holder_name, bank_account_number, bank_bsb)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `,
        updatePaymentMethod: `
            UPDATE payment_methods
            SET guest_id = $1, type = $2, card_number = $3, card_cvv = $4, card_expiration = $5, card_holder_name = $6, bank_account_number = $7, bank_bsb = $8
            WHERE payment_method_id = $9
            RETURNING *
        `,
        deletePaymentMethod: `
            DELETE FROM payment_methods
            WHERE payment_method_id = $1
        `,
        checkPaymentMethodExistsById: `
            SELECT EXISTS(SELECT 1 FROM payment_methods WHERE payment_method_id = $1)
        `
    },
    transactions: {
        getTransactions: `
            SELECT transaction.*, payment_methods.type as payment_method_type, guests.first_name as guest_first_name, guests.last_name as guest_last_name FROM transaction
            INNER JOIN payment_methods ON transaction.payment_method_id = payment_methods.payment_method_id
            INNER JOIN guests ON transaction.guest_id = guests.guest_id
            `,
        getTransactionById: `
            SELECT * FROM transaction WHERE transaction_id = $1
        `,
        getTransactionsByGuestId: `
            SELECT * FROM transaction WHERE guest_id = $1
        `,
        addTransaction: `
            INSERT INTO transaction (payment_method_id, guest_id, amount, description, date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateTransaction: `
            UPDATE transaction
            SET payment_method_id = $1, guest_id = $2, amount = $3, description = $4, date = $5
            WHERE transaction_id = $6
            RETURNING *
        `,
        deleteTransaction: `
            DELETE FROM transaction
            WHERE transaction_id = $1
        `,
        checkTransactionExistsById: `
            SELECT EXISTS(SELECT 1 FROM transaction WHERE transaction_id = $1)
        `
    }
};
exports["default"] = queries;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.camelizeColumns = void 0;
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
/**
 * Camelize all columns in the given data. i.e. convert snake_case to camelCase from postgres columns.
 * @param data
 */
const camelizeColumns = (data) => {
    const template = data[0];
    for (const prop in template) {
        const camel = pg_promise_1.default.utils.camelize(prop);
        if (!(camel in template)) {
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
};
exports.camelizeColumns = camelizeColumns;


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("pg-promise");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const hashPassword_1 = tslib_1.__importDefault(__webpack_require__(17));
const crypto_1 = tslib_1.__importDefault(__webpack_require__(18));
const jsonwebtoken_1 = tslib_1.__importDefault(__webpack_require__(19));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const LogEventTypes_1 = __webpack_require__(23);
/**
 * Users Route
 * @param usersDAO - users DAO
 * @param rolesDAO - roles DAO
 * @param tokenRevocationListDAO - token revocation list DAO
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 * @param log - db event logger
 * @param jwtSecret - jwt secret
 */
const makeUsersRoute = (usersDAO, rolesDAO, tokenRevocationListDAO, authentication, authorization, log, jwtSecret) => {
    const router = express_1.default.Router();
    const { getUsers, getUserById, getUserByUsername, createUser, checkUserExists, checkUserExistsById, deleteUser, updateUser, searchUsers } = usersDAO;
    const { checkRoleExists } = rolesDAO;
    const { revokeToken } = tokenRevocationListDAO;
    /**
     * HTTP GET - /api/users
     * Get all users
     */
    router.get('/', authentication, authorization('users.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield getUsers();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: users
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET - /api/users/search?q=
     * Search for users by first and last name
     */
    router.get("/search", authentication, authorization('users.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = req.query.q;
            if (query === undefined) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.generic.queryNotProvided,
                    data: null
                });
            }
            const users = yield searchUsers(query.toString());
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: users
            });
        }
        catch (e) {
            next(e);
        }
    }));
    router.get('/me', authentication, (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield getUserById(req.userId);
            // if the user is null, return 404
            if (user === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.users.userNotFound(req.userId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: user
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET - /api/users/:userId
     * Get a user by id
     */
    router.get('/:userId', authentication, authorization('users.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.users.invalidUserId(req.params.userId),
                    data: null
                });
            }
            const user = yield getUserById(userId);
            // if the user is null, return 404
            if (user === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.users.userNotFound(userId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: user
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST - /api/users/add
     * Create a new user
     */
    router.post('/add', authentication, authorization('users.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                username: joi_1.default.string().required(),
                password: joi_1.default.string().required(),
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required(),
                email: joi_1.default.string().email().allow('', null).required(),
                phoneNumber: joi_1.default.string().allow('', null).required(),
                position: joi_1.default.string().allow('', null).required(),
                roleId: joi_1.default.number().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null
                });
            }
            if (yield checkUserExists(req.body.username)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.CONFLICT,
                    message: strings_1.default.api.users.usernameConflict(req.body.username),
                    data: null
                });
            }
            if (!(yield checkRoleExists(req.body.roleId))) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.roles.roleNotFound(req.body.roleId),
                    data: null
                });
            }
            const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const user = {
                // the userId is set to 0 because it is not known yet. It will be set by the createUser function, but since we're using
                // typescript, we need to set it to something.
                userId: 0,
                username: req.body.username,
                password: (0, hashPassword_1.default)(req.body.password, salt),
                passwordSalt: salt,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                position: req.body.position,
                roleId: req.body.roleId
            };
            yield createUser(user);
            log(LogEventTypes_1.LogEventTypes.USER_CREATE, req.userId, `Created a new user with username: ${req.body.username} and role: ${req.body.roleId}`);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: user
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP DELETE - /api/users/:userId
     * Delete a user by userId
     */
    router.delete('/:userId', authentication, authorization('users.delete'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            //check if the user is trying to delete themselves
            if (userId === req['userId']) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.users.cannotDeleteSelf,
                    data: null
                });
            }
            if (isNaN(userId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.users.invalidUserId(req.params.userId),
                    data: null
                });
            }
            // check if the user exists
            if (!(yield checkUserExistsById(userId))) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.users.userNotFound(userId),
                    data: null
                });
            }
            yield deleteUser(userId);
            log(LogEventTypes_1.LogEventTypes.USER_DELETE, req.userId, `Deleted user with id: ${userId}`);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST - /api/users/login
     * Login a user
     */
    router.post('/login', (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                username: joi_1.default.string().required(),
                password: joi_1.default.string().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null
                });
            }
            const user = yield getUserByUsername(req.body.username);
            if (user === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.users.usernameNotFound(req.body.username),
                    data: null
                });
            }
            // hash the password from the request body with the password salt from the database
            const hashedPasswordFromRequest = (0, hashPassword_1.default)(req.body.password, user.passwordSalt);
            // check if the hashed password matches the password from the database
            if (hashedPasswordFromRequest !== user.password) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: strings_1.default.api.users.invalidPassword,
                    data: null
                });
            }
            const jwtToken = jsonwebtoken_1.default.sign({
                userId: user.userId,
                roleId: user.roleId,
                username: user.username,
                tokenUUID: crypto_1.default.randomBytes(16).toString('hex')
            }, jwtSecret, {
                expiresIn: '24h'
            });
            log(LogEventTypes_1.LogEventTypes.USER_LOGIN, user.userId, `User ${user.username} logged in`).then();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.users.loginSuccess,
                data: {
                    jwt: jwtToken
                }
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST - /api/users/logout
     * Logout a user by revoking the token.
     */
    router.post('/logout', authentication, (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token === undefined) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.users.invalidToken,
                    data: null
                });
            }
            yield revokeToken(token);
            // decode the token to get the user id
            const decodedToken = jsonwebtoken_1.default.decode(token);
            log(LogEventTypes_1.LogEventTypes.USER_LOGOUT, decodedToken['userId'], `User ${decodedToken['username']} logged out`).then();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.users.logoutSuccess,
                data: null
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP PATCH - /api/users/:userId
     * Update user properties by userId
     */
    router.patch('/:userId', authentication, authorization('users.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.users.invalidUserId(req.params.userId),
                    data: null
                });
            }
            const schema = joi_1.default.object({
                username: joi_1.default.string(),
                password: joi_1.default.string().optional(),
                firstName: joi_1.default.string(),
                lastName: joi_1.default.string(),
                email: joi_1.default.string().email().optional().allow(''),
                phoneNumber: joi_1.default.string().optional().allow(''),
                position: joi_1.default.string().optional().allow(''),
                roleId: joi_1.default.number()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null
                });
            }
            const user = yield getUserById(userId);
            if (user === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.users.userNotFound(userId),
                    data: null
                });
            }
            // check if the username is already taken
            if (req.body.username !== undefined) {
                if (req.body.username !== user.username) {
                    if (yield checkUserExists(req.body.username)) {
                        return (0, sendResponse_1.default)(res, {
                            success: false,
                            statusCode: http_status_codes_1.StatusCodes.CONFLICT,
                            message: strings_1.default.api.users.usernameConflict(req.body.username),
                            data: null
                        });
                    }
                }
            }
            // check if the role id is valid
            if (req.body.roleId !== undefined) {
                if (req.body.roleId !== user.roleId) {
                    if (!(yield checkRoleExists(req.body.roleId))) {
                        return (0, sendResponse_1.default)(res, {
                            success: false,
                            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                            message: strings_1.default.api.roles.roleNotFound(req.body.roleId),
                            data: null
                        });
                    }
                }
            }
            const updatedUser = Object.assign(Object.assign({}, user), req.body);
            // hash the password if it is defined
            if (req.body.password !== undefined) {
                const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                updatedUser.passwordSalt = salt;
                updatedUser.password = (0, hashPassword_1.default)(req.body.password, salt);
            }
            yield updateUser(updatedUser);
            log(LogEventTypes_1.LogEventTypes.USER_UPDATE, req.userId, `Updated user with id: ${userId}`);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: updatedUser
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports["default"] = makeUsersRoute;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const strings = {
    // API Response Messages
    api: {
        generic: {
            success: "Success",
            error: "An unknown error has occurred, please try again later.",
            queryNotProvided: "Query not provided",
            invalidQuery: "Invalid query",
            invalidRequestBody: "Invalid request body",
        },
        notes: {
            invalidNoteId: (noteId) => `Invalid note id: ${noteId}`,
            noteNotFound: (noteId) => `Note with id ${noteId} not found`,
        },
        guest: {
            invalidGuestId: (guestId) => `Invalid guest id: ${guestId}`,
            guestNotFound: (guestId) => `Guest with id ${guestId} not found`,
            cannotDeleteGuestAsTheyHaveReservations: `Cannot delete guest as they have reservations`,
        },
        paymentMethods: {
            paymentMethodNotFound: (paymentMethodId) => `Payment method with id ${paymentMethodId} not found`,
            invalidPaymentMethodId: (paymentMethodId) => `Invalid payment method id: ${paymentMethodId}`,
            invalidCardCVV: `Invalid card CVV`,
        },
        reservations: {
            invalidReservationId: (reservationId) => `Invalid reservation id: ${reservationId}`,
            reservationNotFound: (reservationId) => `Reservation with id ${reservationId} not found`,
            roomUnavailableForDates: (roomId) => `Room with id ${roomId} is unavailable for the specified dates.`,
        },
        room: {
            invalidRoomId: (roomId) => `Invalid room id: ${roomId}`,
            roomNotFound: (roomId) => `Room with id ${roomId} not found`,
            roomCodeConflict: (roomCode) => `Room with code ${roomCode} already exists`,
        },
        tickets: {
            invalidTicketId: (ticketId) => `Invalid ticket id: ${ticketId}`,
            ticketNotFound: (ticketId) => `Ticket with id ${ticketId} not found`,
        },
        users: {
            invalidUserId: (userId) => `Invalid user id: ${userId}`,
            userNotFound: (userId) => `User with id ${userId} not found`,
            usernameNotFound: (username) => `User with username ${username} not found`,
            usernameConflict: (username) => `User with username ${username} already exists`,
            cannotDeleteSelf: `Cannot delete self`,
            invalidPassword: `Invalid password`,
            loginSuccess: `Login success`,
            invalidToken: `Invalid token`,
            logoutSuccess: `Logout success`,
            unauthenticated: `Unauthenticated`,
            unauthorized: `Unauthorized`,
        },
        roles: {
            invalidRoleId: (roleId) => `Invalid role id: ${roleId}`,
            roleNotFound: (roleId) => `Role with id ${roleId} not found`,
            cannotDeleteRoleAsOtherUsersHaveIt: `Cannot delete role as other users have it`,
            roleAlreadyExists: (roleName) => `Role with name ${roleName} already exists`,
        },
        transactions: {
            invalidTransactionId: (transactionId) => `Invalid transaction id: ${transactionId}`,
            transactionNotFound: (transactionId) => `Transaction with id ${transactionId} not found`,
        },
    }
};
exports["default"] = strings;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const crypto_1 = tslib_1.__importDefault(__webpack_require__(18));
/**
 * Hashes the password with the salt
 * @param password - password to hash
 * @param salt - salt to hash with
 */
const hashPassword = (password, salt) => {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
};
exports["default"] = hashPassword;


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Send response to the client
 * @param res - express response object
 * @param responseObj - response object
 */
const sendResponse = (res, responseObj) => {
    res.status(responseObj.statusCode).json(responseObj);
};
exports["default"] = sendResponse;


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("http-status-codes");

/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("joi");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogEventTypes = void 0;
var LogEventTypes;
(function (LogEventTypes) {
    LogEventTypes["USER_LOGIN"] = "USER_LOGIN";
    LogEventTypes["USER_LOGOUT"] = "USER_LOGOUT";
    LogEventTypes["USER_ADD"] = "USER_ADD";
    LogEventTypes["USER_CREATE"] = "USER_CREATE";
    LogEventTypes["USER_UPDATE"] = "USER_UPDATE";
    LogEventTypes["USER_DELETE"] = "USER_DELETE";
    LogEventTypes["GUEST_ADD"] = "GUEST_ADD";
    LogEventTypes["GUEST_UPDATE"] = "GUEST_UPDATE";
    LogEventTypes["GUEST_DELETE"] = "GUEST_DELETE";
    LogEventTypes["GUEST_CHECKIN"] = "GUEST_CHECKIN";
    LogEventTypes["GUEST_CHECKOUT"] = "GUEST_CHECKOUT";
    LogEventTypes["ROOM_CREATE"] = "ROOM_CREATE";
    LogEventTypes["ROOM_UPDATE"] = "ROOM_UPDATE";
    LogEventTypes["ROOM_DELETE"] = "ROOM_DELETE";
    LogEventTypes["ROOM_CHECKIN"] = "ROOM_CHECKIN";
    LogEventTypes["RESERVATION_CREATE"] = "RESERVATION_CREATE";
    LogEventTypes["RESERVATION_UPDATE"] = "RESERVATION_UPDATE";
    LogEventTypes["RESERVATION_DELETE"] = "RESERVATION_DELETE";
    LogEventTypes["ROLE_CREATE"] = "ROLE_CREATE";
    LogEventTypes["ROLE_UPDATE"] = "ROLE_UPDATE";
    LogEventTypes["ROLE_DELETE"] = "ROLE_DELETE";
    LogEventTypes["ROLE_ASSIGN"] = "ROLE_ASSIGN";
    LogEventTypes["TRANSACTION_CREATE"] = "TRANSACTION_CREATE";
    LogEventTypes["TRANSACTION_UPDATE"] = "TRANSACTION_UPDATE";
    LogEventTypes["TRANSACTION_DELETE"] = "TRANSACTION_DELETE";
    LogEventTypes["PAYMENT_METHOD_CREATE"] = "PAYMENT_METHOD_CREATE";
    LogEventTypes["PAYMENT_METHOD_UPDATE"] = "PAYMENT_METHOD_UPDATE";
    LogEventTypes["PAYMENT_METHOD_DELETE"] = "PAYMENT_METHOD_DELETE";
    LogEventTypes["CALENDAR_NOTE_CREATE"] = "CALENDAR_NOTE_CREATE";
    LogEventTypes["CALENDAR_NOTE_UPDATE"] = "CALENDAR_NOTE_UPDATE";
    LogEventTypes["CALENDAR_NOTE_DELETE"] = "CALENDAR_NOTE_DELETE";
    LogEventTypes["TICKET_CREATE"] = "TICKET_CREATE";
    LogEventTypes["TICKET_UPDATE"] = "TICKET_UPDATE";
    LogEventTypes["TICKET_DELETE"] = "TICKET_DELETE";
    LogEventTypes["TICKET_COMMENT_CREATE"] = "TICKET_COMMENT_CREATE";
})(LogEventTypes || (exports.LogEventTypes = LogEventTypes = {}));


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeRoomsRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const http_status_codes_1 = __webpack_require__(21);
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const models_1 = __webpack_require__(25);
const LogEventTypes_1 = __webpack_require__(23);
/**
 * Rooms Route
 * @param roomsDAO - rooms DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeRoomsRoute = (roomsDAO, log, authentication, authorization) => {
    const router = express_1.default.Router();
    const { getRooms, getRoomById, createRoom, checkRoomExistsById, updateRoom, deleteRoom, checkRoomExistsByRoomCode, searchRoomsByRoomCode, getRoomStatusCount, getReservationsByRoomId } = roomsDAO;
    /**
     * GET /api/rooms
     * Get all rooms
     */
    router.get('/', authentication, authorization('rooms.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            try {
                const rooms = yield getRooms();
                return (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_codes_1.StatusCodes.OK,
                    message: "Success",
                    data: rooms
                });
            }
            catch (e) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "An unknown error has occurred, please try again later.",
                    data: e
                });
            }
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * GET /api/rooms/room-status-count
     * Get room status count
     */
    router.get('/room-status-count', authentication, authorization('rooms.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomStatusCount = yield getRoomStatusCount();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: roomStatusCount
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * GET /api/rooms/search?q=roomCode
     * Search rooms by roomCode
     */
    router.get('/search', authentication, authorization('rooms.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomCode = req.query.q;
            // check if query is provided
            if (!roomCode) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.generic.queryNotProvided,
                    data: null
                });
            }
            const rooms = yield searchRoomsByRoomCode(roomCode);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: rooms
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * GET /api/rooms/:roomId
     * Get room by id
     */
    router.get('/:roomId', authentication, authorization('rooms.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = parseInt(req.params.roomId);
            if (isNaN(roomId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.room.invalidRoomId(roomId),
                    data: null
                });
            }
            const room = yield getRoomById(roomId);
            if (room === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.room.roomNotFound(roomId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: room
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * POST /api/rooms/add
     * Adds a new room
     */
    router.post("/add", authentication, authorization('rooms.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                roomCode: joi_1.default.string().required(),
                pricePerNight: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required().valid(...Object.values(models_1.RoomStatuses))
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.details[0].message,
                    data: null
                });
            }
            // check if room with roomCode already exists
            const roomCodeExists = yield checkRoomExistsByRoomCode(req.body.roomCode);
            if (roomCodeExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.CONFLICT,
                    message: strings_1.default.api.room.roomCodeConflict(req.body.roomCode),
                    data: null
                });
            }
            const room = {
                roomCode: req.body.roomCode,
                pricePerNight: req.body.pricePerNight,
                description: req.body.description,
                status: req.body.status
            };
            const newRoom = yield createRoom(room);
            log(LogEventTypes_1.LogEventTypes.ROOM_CREATE, req.userId, "Created a new room with roomCode: " + req.body.roomCode + " and pricePerNight: " + req.body.pricePerNight);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: newRoom
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * PATCH /api/rooms/:roomId
     * Updates a room
     */
    router.patch("/:roomId", authentication, authorization('rooms.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = parseInt(req.params.roomId);
            if (isNaN(roomId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.room.invalidRoomId(roomId),
                    data: null
                });
            }
            const schema = joi_1.default.object({
                roomCode: joi_1.default.string().required(),
                pricePerNight: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required().valid(...Object.values(models_1.RoomStatuses))
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.details[0].message,
                    data: null
                });
            }
            const room = {
                roomId: roomId,
                roomCode: req.body.roomCode,
                pricePerNight: req.body.pricePerNight,
                description: req.body.description,
                status: req.body.status
            };
            const roomExists = yield checkRoomExistsById(roomId);
            if (!roomExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.room.roomNotFound(roomId),
                    data: null
                });
            }
            const updatedRoom = yield updateRoom(room);
            log(LogEventTypes_1.LogEventTypes.ROOM_UPDATE, req.userId, "Updated room with id: " + roomId + " to roomCode: " + req.body.roomCode + " and pricePerNight: " + req.body.pricePerNight);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: updatedRoom
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * DELETE /api/rooms/:roomId
     * Deletes a room
     */
    router.delete("/:roomId", authentication, authorization('rooms.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = parseInt(req.params.roomId);
            if (isNaN(roomId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.room.invalidRoomId(roomId),
                    data: null
                });
            }
            const roomExists = yield checkRoomExistsById(roomId);
            if (!roomExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.room.roomNotFound(roomId),
                    data: null
                });
            }
            const reservationsWithRoom = yield getReservationsByRoomId(roomId);
            if (reservationsWithRoom.length > 0) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Cannot delete room as it has reservations",
                    data: null
                });
            }
            yield deleteRoom(roomId);
            log(LogEventTypes_1.LogEventTypes.ROOM_DELETE, req.userId, "Deleted room with id: " + roomId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports.makeRoomsRoute = makeRoomsRoute;


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(26), exports);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.models = void 0;
const tslib_1 = __webpack_require__(1);
function models() {
    return 'models';
}
exports.models = models;
tslib_1.__exportStar(__webpack_require__(27), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(35), exports);
tslib_1.__exportStar(__webpack_require__(36), exports);
tslib_1.__exportStar(__webpack_require__(37), exports);
tslib_1.__exportStar(__webpack_require__(38), exports);
tslib_1.__exportStar(__webpack_require__(39), exports);
tslib_1.__exportStar(__webpack_require__(40), exports);
tslib_1.__exportStar(__webpack_require__(41), exports);
tslib_1.__exportStar(__webpack_require__(42), exports);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PriceUnits = void 0;
var PriceUnits;
(function (PriceUnits) {
    PriceUnits["day"] = "day";
    PriceUnits["week"] = "week";
    PriceUnits["month"] = "month";
    PriceUnits["year"] = "year";
    PriceUnits["night"] = "night";
})(PriceUnits || (exports.PriceUnits = PriceUnits = {}));


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomStatuses = void 0;
var RoomStatuses;
(function (RoomStatuses) {
    RoomStatuses["AVAILABLE"] = "Available";
    RoomStatuses["UNAVAILABLE"] = "Unavailable";
    RoomStatuses["RESERVED"] = "Reserved";
    RoomStatuses["OCCUPIED"] = "Occupied";
    RoomStatuses["OUT_OF_SERVICE"] = "Out of Service";
})(RoomStatuses || (exports.RoomStatuses = RoomStatuses = {}));


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TicketStatuses = void 0;
var TicketStatuses;
(function (TicketStatuses) {
    TicketStatuses["OPEN"] = "Open";
    TicketStatuses["IN_PROGRESS"] = "In Progress";
    TicketStatuses["CLOSED"] = "Closed";
})(TicketStatuses || (exports.TicketStatuses = TicketStatuses = {}));


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 43 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
var queryResultErrorCode = pg_promise_1.default.errors.queryResultErrorCode;
const makeUsersDAO = (db) => {
    /**
     * Get all users
     * @returns A promise that resolves to a list of users
     */
    const getUsers = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const users = yield db.any(queries_1.default.users.getAllUsers);
        return users;
    });
    /**
     * Get a user by id
     *
     * @param userId The id of the user
     * @returns A promise that resolves to the user if found, or null if not found
     */
    const getUserById = (userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.oneOrNone(queries_1.default.users.getUserById, [
                userId,
            ]);
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return null;
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Get a user by username
     * @param username
     * @returns A promise that resolves to the user if found, or null if not found
     */
    const getUserByUsername = (username) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.oneOrNone(queries_1.default.users.getUserByUsername, [
                username,
            ]);
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return null;
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Create a new user
     * @param user
     * @returns A promise that resolves to the created user with the id set.
     */
    const createUser = (user) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const createdUser = yield db.one(queries_1.default.users.createUser, [
            user.username,
            user.password,
            user.passwordSalt,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.position,
            user.roleId,
        ]);
        user.userId = createdUser.userId;
        return user;
    });
    /**
     * Check if a user with the given username exists
     *
     * @param username
     * @returns A promise that resolves to true if the user exists, or false if not.
     */
    const checkUserExists = (username) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db.one(queries_1.default.users.getUserByUsername, [
                username,
            ]);
            return true;
        }
        catch (e) {
            if (e instanceof QueryResultError &&
                e.code === queryResultErrorCode.noData) {
                return false;
            }
            else {
                throw e;
            }
        }
    });
    const checkUserExistsById = (userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db.one(queries_1.default.users.getUserById, [userId]);
            return true;
        }
        catch (e) {
            if (e instanceof QueryResultError &&
                e.code === queryResultErrorCode.noData) {
                return false;
            }
            else {
                throw e;
            }
        }
    });
    /**
     * Delete a user by id
     *
     * @param userId
     * @returns A promise that resolves to void
     */
    const deleteUser = (userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.users.deleteUser, [userId]);
    });
    const updateUser = (user) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.users.updateUser, [
            user.username,
            user.password,
            user.passwordSalt,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.position,
            user.roleId,
            user.userId,
        ]);
    });
    /**
     * Search for users by first name or last name
     * @param query
     * @returns A promise that resolves to a list of users, an empty list if no users are found.
     */
    const searchUsers = (query) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.any(queries_1.default.users.searchUsers, [
                query,
            ]);
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return [];
            }
        }
    });
    return {
        getUsers,
        getUserById,
        getUserByUsername,
        createUser,
        checkUserExists,
        checkUserExistsById,
        deleteUser,
        updateUser,
        searchUsers,
    };
};
exports["default"] = makeUsersDAO;


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeRolesDAO = void 0;
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var queryResultErrorCode = pg_promise_1.default.errors.queryResultErrorCode;
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
/**
 * Roles DAO
 * @param db
 */
const makeRolesDAO = (db) => {
    /**
     * Get role by id
     * @param roleId
     * @returns A promise that resolves to a role or null if no role is found.
     */
    const getRoleById = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.oneOrNone(queries_1.default.roles.getRoleById, [roleId]);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Check if role exists
     * @param roleId
     * @returns A promise that resolves to true if role exists, false otherwise.
     */
    const checkRoleExists = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.one(queries_1.default.roles.checkRoleExists, [roleId]);
        return result.exists;
    });
    const checkRoleExistsByName = (roleName) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.one(queries_1.default.roles.checkRoleExistsByName, [roleName]);
        return result.exists;
    });
    /**
     * Add role.
     * @param role
     * @returns A promise that resolves to the added role containing the role id.
     */
    const addRole = (role) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.roles.addRole, [role.name, role.permissionData]);
    });
    /**
     * Update role.
     * @param role
     * @returns A promise that resolves to the updated role.
     */
    const updateRole = (role) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.roles.updateRole, [role.name, role.permissionData, role.roleId]);
    });
    const getUsersWithRoles = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.manyOrNone(queries_1.default.roles.getUsersWithRoles, [roleId]);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            throw err;
        }
    });
    /**
     * Delete role.
     * @param roleId
     * @returns A promise that resolves to void.
     */
    const deleteRole = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.roles.deleteRole, [roleId]);
    });
    /**
     * Get all roles.
     * @returns A promise that resolves to an array of roles.
     */
    const getAllRoles = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.manyOrNone(queries_1.default.roles.getAllRoles);
    });
    return {
        getRoleById,
        checkRoleExists,
        addRole,
        updateRole,
        getAllRoles,
        deleteRole,
        getUsersWithRoles,
        checkRoleExistsByName
    };
};
exports.makeRolesDAO = makeRolesDAO;
exports["default"] = exports.makeRolesDAO;


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const makeTokenRevocationListDAO = (db) => {
    /**
     * Revoke token
     * @param token
     * @returns - void
     */
    const revokeToken = (token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        yield db.none(queries_1.default.tokenRevocationList.revokeToken, [token, now]);
    });
    /**
     * Check if token is revoked
     * @param token
     * @returns - boolean
     */
    const checkTokenRevoked = (token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const tokenRevocationList = yield db.oneOrNone(queries_1.default.tokenRevocationList.checkTokenRevoked, [token]);
        return tokenRevocationList !== null;
    });
    return {
        revokeToken,
        checkTokenRevoked
    };
};
exports["default"] = makeTokenRevocationListDAO;


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const jsonwebtoken_1 = tslib_1.__importDefault(__webpack_require__(19));
/**
 * Authentication middleware, handles jwt token verification
 * @param jwtSecret - jwt secret
 * @param tokenRevocationListDAO - token revocation list DAO
 */
const makeAuthenticationMiddleware = (jwtSecret, tokenRevocationListDAO) => {
    const { checkTokenRevoked } = tokenRevocationListDAO;
    return (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // check if the request has a jwt token
        if (!req.headers.authorization) {
            return res.status(401).send({
                success: false,
                message: strings_1.default.api.users.unauthenticated,
                statusCode: 401,
                data: null
            });
        }
        // verify the jwt token in Authorization Bearer header
        const token = req.headers.authorization.split(' ')[1];
        // check if the token is in the token revocation list
        const tokenRevoked = yield checkTokenRevoked(token);
        // if the token is in the token revocation list, return 401
        if (tokenRevoked) {
            return res.status(401).send({
                success: false,
                message: strings_1.default.api.users.invalidToken,
                statusCode: 401,
                data: null
            });
        }
        // verify the token
        jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: strings_1.default.api.users.invalidToken,
                    statusCode: 401,
                    data: null
                });
            }
            // add the user id to the request
            req.userId = decoded.userId;
            req.userRoleId = decoded.roleId;
            // authentication successful, continue
            next();
        });
    });
};
exports["default"] = makeAuthenticationMiddleware;


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const checkPermissions_1 = tslib_1.__importDefault(__webpack_require__(49));
/**
 * Authorization middleware, handles authorization, checks if the user has the required permission.
 * @param rolesDAO
 */
const makeAuthorizationMiddleware = (rolesDAO) => {
    const hasPermission = (0, checkPermissions_1.default)(rolesDAO);
    /**
     * @param requiredPermission - the required permission
     */
    return (requiredPermission) => {
        const response = {
            success: false,
            statusCode: 500,
            message: "An unknown error has occurred, please try again later.",
            data: null
        };
        return (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            // check if the user has a role id
            if (req.userRoleId === undefined) {
                response.statusCode = 401;
                response.message = strings_1.default.api.users.unauthenticated;
                return res.status(response.statusCode).send(response);
            }
            // check if the user has the required permission
            const userHasPermission = yield hasPermission(requiredPermission, req.userRoleId);
            if (!userHasPermission) {
                response.statusCode = 401;
                response.message = strings_1.default.api.users.unauthorized;
                return res.status(response.statusCode).send(response);
            }
            // user has the required permission, continue
            next();
        });
    };
};
exports["default"] = makeAuthorizationMiddleware;


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Permission Checker
 * @param rolesDAO
 */
const makePermissionChecker = (rolesDAO) => {
    const { getRoleById } = rolesDAO;
    /**
     * Check if a role has the required permission
     * @param requiredPermission - permission to check
     * @param roleId - role id to check
     */
    return (requiredPermission, roleId) => {
        return new Promise((resolve) => {
            getRoleById(roleId).then(role => {
                if (role === null) {
                    resolve(false);
                }
                const permissions = role.permissionData;
                if (permissions.includes(requiredPermission) || permissions.includes("*")) {
                    resolve(true);
                }
                resolve(false);
            });
        });
    };
};
exports["default"] = makePermissionChecker;


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("process");

/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const LogEventTypes_1 = __webpack_require__(23);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
/**
 * Roles Route
 * @param rolesDAO - roles DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeRolesRoute = (rolesDAO, log, authentication, authorization) => {
    const { getAllRoles, addRole, deleteRole, checkRoleExists, getUsersWithRoles, getRoleById, updateRole, checkRoleExistsByName } = rolesDAO;
    const router = express_1.default.Router();
    /**
     * HTTP GET /api/roles
     * Get all roles
     */
    router.get("/", authentication, authorization("roles.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roles = yield getAllRoles();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: roles,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST /api/roles/add
     * Add a new role
     */
    router.post("/add", authentication, authorization("roles.add"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                name: joi_1.default.string().required(),
                permissionData: joi_1.default.array().items(joi_1.default.string()).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.generic.invalidRequestBody,
                    data: error.message,
                });
            }
            // check if role exists
            const roleExists = yield checkRoleExistsByName(req.body.name);
            if (roleExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.roles.roleAlreadyExists(req.body.name),
                    data: null,
                });
            }
            const newRole = {
                name: req.body.name,
                permissionData: req.body.permissionData
            };
            const role = yield addRole(newRole);
            log(LogEventTypes_1.LogEventTypes.ROLE_CREATE, req.userId, "Created a new role with name: " + req.body.name + " and permissions: " + req.body.permissionData);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: role,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP DELETE /api/roles/:roleId
     * Delete a role
     */
    router.delete("/:roleId", authentication, authorization("roles.delete"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roleId = parseInt(req.params.roleId);
            // check if role exists
            const roleExists = yield checkRoleExists(roleId);
            if (!roleExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.roles.roleNotFound(roleId),
                    data: null,
                });
            }
            // check if any user has this role
            const usersWithRole = yield getUsersWithRoles(roleId);
            if (usersWithRole.length > 0) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.roles.cannotDeleteRoleAsOtherUsersHaveIt,
                    data: null,
                });
            }
            const role = yield deleteRole(roleId);
            log(LogEventTypes_1.LogEventTypes.ROLE_DELETE, req.userId, "Deleted role with id: " + roleId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: role,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/roles/:roleId
     * Get role by id
     */
    router.get("/:roleId", authentication, authorization("roles.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roleId = parseInt(req.params.roleId);
            // check if role exists
            const roleExists = yield checkRoleExists(roleId);
            if (!roleExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.roles.roleNotFound(roleId),
                    data: null,
                });
            }
            const role = yield getRoleById(roleId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: role,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP PATCH /api/roles/:roleId
     * Update a role
     */
    router.patch("/:roleId", authentication, authorization("roles.update"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roleId = parseInt(req.params.roleId);
            // check if role exists
            const roleExists = yield getRoleById(roleId);
            if (roleExists === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.roles.roleNotFound(roleId),
                    data: null,
                });
            }
            const schema = joi_1.default.object({
                name: joi_1.default.string().required(),
                permissionData: joi_1.default.array().items(joi_1.default.string()).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.generic.invalidRequestBody,
                    data: error.message,
                });
            }
            // check if role exists
            const roleExistsByName = yield checkRoleExistsByName(req.body.name);
            if (roleExistsByName && roleExists.name !== req.body.name) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.roles.roleAlreadyExists(req.body.name),
                    data: null,
                });
            }
            const updatedRole = {
                roleId: roleId,
                name: req.body.name,
                permissionData: req.body.permissionData
            };
            const role = yield updateRole(updatedRole);
            log(LogEventTypes_1.LogEventTypes.ROLE_UPDATE, req.userId, "Updated role with id: " + roleId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: role,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports["default"] = makeRolesRoute;


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
/**
 * Logs Route
 * @param logsDAO - logs DAO
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeLogsRoute = (logsDAO, authentication, authorization) => {
    const router = express_1.default.Router();
    const { getAllLogs, } = logsDAO;
    /**
     * HTTP GET /api/logs
     * Get all logs
     */
    router.get("/", authentication, authorization("logs.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const logs = yield getAllLogs();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: logs
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports["default"] = makeLogsRoute;


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
/**
 * Logs DAO
 * @param db - database object
 */
const makeLogsDAO = (db) => {
    /**
     * Get all logs
     */
    const getAllLogs = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.logs.getAllLogs);
    });
    /**
     * Add log
     * @param log
     * @returns logs, null if no logs
     */
    const addLog = (log) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.one(queries_1.default.logs.addLog, [log.eventType, log.timestamp, log.userId, log.description]);
        }
        catch (error) {
            if (error instanceof QueryResultError && error.code === pg_promise_1.default.errors.queryResultErrorCode.noData) {
                return null;
            }
            throw error;
        }
    });
    /**
     * Delete log
     * @param logId
     * @returns void
     */
    const deleteLog = (logId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.logs.deleteLog, { logId });
    });
    return {
        getAllLogs,
        addLog,
        deleteLog,
    };
};
exports["default"] = makeLogsDAO;


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
var queryResultErrorCode = pg_promise_1.default.errors.queryResultErrorCode;
/**
 * Guest DAO
 * @param db - database object
 */
const makeGuestDAO = (db) => {
    /**
     * Get payment methods by guest id
     * @param guestId - guest id
     * @returns - array of payment methods
     */
    const getPaymentMethodsByGuestId = (guestId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.paymentMethods.getPaymentMethodsByGuestId, [guestId]);
    });
    /**
     * Get all guests
     * @returns - array of guests, empty array if no guests
     * @throws - error
     */
    const getGuests = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.any(queries_1.default.guests.getGuests);
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return [];
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Add guest
     * @param guest
     * @returns - guest object
     */
    const addGuest = (guest) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.guests.addGuest, [
            guest.firstName,
            guest.lastName,
            guest.email,
            guest.phoneNumber,
            guest.address
        ]);
    });
    /**
     * Update guest
     * @param guest
     * @returns - guest object
     */
    const updateGuest = (guest) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.guests.updateGuest, [
            guest.firstName,
            guest.lastName,
            guest.email,
            guest.phoneNumber,
            guest.address,
            guest.guestId
        ]);
    });
    /**
     * Delete guest
     * @param guestId
     * @returns - void
     */
    const deleteGuest = (guestId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.guests.deleteGuest, [
            guestId
        ]);
    });
    /**
     * Check if guest exists by id
     * @param id
     * @returns - boolean
     */
    const checkGuestExistsById = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.guests.checkGuestExistsById, [
            id
        ]);
        return exists.exists;
    });
    /**
     * Get guest by id
     * @param id
     * @returns - guest object
     */
    const getGuestById = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.one(queries_1.default.guests.getGuestById, [
                id
            ]);
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return null;
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Search guests
     * @param query
     * @returns - array of guests
     */
    const searchGuests = (query) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.any(queries_1.default.guests.searchGuests, [
                query
            ]);
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return [];
            }
            else {
                throw err;
            }
        }
    });
    return {
        getGuests,
        addGuest,
        updateGuest,
        deleteGuest,
        checkGuestExistsById,
        getGuestById,
        searchGuests,
        getPaymentMethodsByGuestId
    };
};
exports["default"] = makeGuestDAO;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const LogEventTypes_1 = __webpack_require__(23);
/**
 * Guest Route
 * @param guestsDAO - guests DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeGuestsRoute = (guestsDAO, reservationsDAO, log, authentication, authorization) => {
    const { getGuests, addGuest, updateGuest, deleteGuest, checkGuestExistsById, getGuestById, searchGuests, getPaymentMethodsByGuestId } = guestsDAO;
    const { getReservationsByGuestId } = reservationsDAO;
    const router = express_1.default.Router();
    /**
     * HTTP GET /api/guests
     * Get all guests
     */
    router.get("/", authentication, authorization("guests.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guests = yield getGuests();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: guests,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/guests/search?q=...
     * Search guests
     */
    router.get("/search", authentication, authorization('guests.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = req.query.q;
            if (query === undefined || query === null || query === "") {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.generic.queryNotProvided,
                    data: null
                });
            }
            const users = yield searchGuests(query.toString());
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: users
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/guests/:guestId/payment-methods
     * Get payment methods by guest id
     */
    router.get("/:guestId/payment-methods", authentication, authorization("paymentMethods.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.guest.invalidGuestId(guestId),
                    data: null,
                });
            }
            // check if guest exists
            const guestExists = yield checkGuestExistsById(guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(guestId),
                    data: null,
                });
            }
            const paymentMethods = yield getPaymentMethodsByGuestId(guestId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: paymentMethods,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/guests/:guestId
     * Get guest by id
     */
    router.get("/:guestId", authentication, authorization("guests.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.guest.invalidGuestId(guestId),
                    data: null,
                });
            }
            const guest = yield getGuestById(guestId);
            if (guest === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(guestId),
                    data: null,
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: guest,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST /api/guests/add
     * Add a new guest
     */
    router.post("/add", authentication, authorization("guests.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required(),
                phoneNumber: joi_1.default.string().optional().allow(""),
                address: joi_1.default.string().optional().allow(""),
                email: joi_1.default.string().email().optional().allow(""),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: error.message,
                });
            }
            const newGuest = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                email: req.body.email,
            };
            const guest = yield addGuest(newGuest);
            log(LogEventTypes_1.LogEventTypes.GUEST_ADD, req.userId, "Added a new guest with id: " + guest.guestId + " and name: " + guest.firstName + " " + guest.lastName);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: guest,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP PATCH /api/guests/:guestId
     * Update guest by id
     */
    router.patch("/:guestId", authentication, authorization("guests.update"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.guest.invalidGuestId(guestId),
                    data: null,
                });
            }
            // check if guest exists
            const guestExists = yield checkGuestExistsById(guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(guestId),
                    data: null,
                });
            }
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required(),
                phoneNumber: joi_1.default.string().optional().allow(""),
                address: joi_1.default.string().optional().allow(""),
                email: joi_1.default.string().email().optional().allow(""),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: error.message,
                });
            }
            const updatedGuest = {
                guestId: guestId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                email: req.body.email,
            };
            const guest = yield updateGuest(updatedGuest);
            log(LogEventTypes_1.LogEventTypes.GUEST_UPDATE, req.userId, "Updated guest with id: " + guestId + " to name: " + req.body.firstName + " " + req.body.lastName);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: guest,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP DELETE /api/guests/:guestId
     * Delete guest by id
     */
    router.delete("/:guestId", authentication, authorization("guests.delete"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.guest.invalidGuestId(guestId),
                    data: null,
                });
            }
            // check if guest exists
            const guestExists = yield checkGuestExistsById(guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(guestId),
                    data: null,
                });
            }
            const guestReservations = yield getReservationsByGuestId(guestId);
            if (guestReservations.length > 0) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.guest.cannotDeleteGuestAsTheyHaveReservations,
                    data: null,
                });
            }
            const guest = yield deleteGuest(guestId);
            log(LogEventTypes_1.LogEventTypes.GUEST_DELETE, req.userId, "Deleted guest with id: " + guestId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports["default"] = makeGuestsRoute;


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeReservationDAO = void 0;
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const pgPromise = __webpack_require__(13);
var QueryResultError = pgPromise.errors.QueryResultError;
var queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
/**
 * Reservation DAO
 * @param db - database object
 */
const makeReservationDAO = (db) => {
    /**
     * Get all reservations
     */
    const getReservations = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.any(queries_1.default.reservations.getReservations);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Get reservation by id
     * @param reservationId
     * @returns reservation, null if no reservation
     */
    const getReservationById = (reservationId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.oneOrNone(queries_1.default.reservations.getReservationById, [reservationId]);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Check if reservation exists by id
     * @param reservationId
     * @returns boolean
     */
    const checkReservationExistsById = (reservationId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.reservations.checkReservationExistsById, [reservationId]);
        return exists.exists;
    });
    /**
     * Create reservation
     * @param reservation
     * @returns reservation
     */
    const createReservation = (reservation) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.reservations.addReservation, [reservation.roomId, reservation.guestId, reservation.startDate, reservation.endDate, reservation.reservationStatus]);
    });
    /**
     * Update reservation
     * @param reservation
     * @returns reservation
     */
    const updateReservation = (reservation) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.reservations.updateReservation, [
            reservation.roomId,
            reservation.guestId,
            reservation.startDate,
            reservation.endDate,
            reservation.reservationStatus,
            reservation.checkInDate,
            reservation.checkOutDate,
            reservation.reservationId
        ]);
    });
    /**
     * Delete reservation
     * @param reservationId
     * @returns void
     */
    const deleteReservation = (reservationId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.reservations.deleteReservation, [reservationId]);
    });
    /**
     * Get reservations by guest id
     * @param guestId
     * @returns reservations
     */
    const getReservationsByGuestId = (guestId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.any(queries_1.default.reservations.getReservationsByGuestId, [guestId]);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Check if reservation is available
     * @param roomId The room id
     * @param startDate The start date
     * @param endDate The end date
     */
    const checkIfReservationIsAvailable = (roomId, startDate, endDate) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.reservations.checkIfReservationIsAvailable, [roomId, startDate, endDate]);
        return !exists.exists;
    });
    /**
     * Get database
     */
    const getDb = () => {
        return db;
    };
    return {
        getReservations,
        getReservationById,
        createReservation,
        deleteReservation,
        updateReservation,
        checkReservationExistsById,
        getReservationsByGuestId,
        checkIfReservationIsAvailable,
        getDb
    };
};
exports.makeReservationDAO = makeReservationDAO;


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeReservationsRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const ReservationStatuses_1 = __webpack_require__(58);
const LogEventTypes_1 = __webpack_require__(23);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const dayjs = __webpack_require__(59);
const utc = __webpack_require__(60);
dayjs.extend(utc);
/**
 * Reservations Route
 * @param reservationsDAO - reservations DAO
 * @param guestsDAO - guests DAO
 * @param roomsDAO - rooms DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeReservationsRoute = (reservationsDAO, guestsDAO, roomsDAO, log, authentication, authorization) => {
    const router = express_1.default.Router();
    const { getReservations, getReservationById, createReservation, checkReservationExistsById, updateReservation, deleteReservation, getReservationsByGuestId, checkIfReservationIsAvailable, } = reservationsDAO;
    const { checkGuestExistsById } = guestsDAO;
    const { checkRoomExistsById } = roomsDAO;
    /**
     * HTTP GET /api/reservations/guest/:guestId
     * Get all reservations
     */
    router.get("/", authentication, authorization("reservations.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservations = yield getReservations();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: reservations,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/reservations/guest/:guestId
     * Get all reservations
     */
    router.get("/search", authentication, authorization("reservations.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const db = reservationsDAO.getDb();
            const { startDate, endDate, guestId, checkInDate, checkOutDate, } = req.query;
            let query = 'SELECT * FROM reservations WHERE 1=1 ';
            const params = {};
            if (checkInDate) {
                query += 'AND DATE(check_in_date) = $/checkInDate/ ';
                params['checkInDate'] = new Date(checkInDate + 'T00:00:00Z');
            }
            if (checkOutDate) {
                query += 'AND DATE(check_out_date) = $/checkOutDate/ ';
                params['checkOutDate'] = new Date(checkOutDate + 'T00:00:00Z');
            }
            if (startDate) {
                const startDateParam = new Date(startDate);
                query += 'AND start_date >= $/startDate/ ';
                params['startDate'] = startDateParam;
            }
            if (endDate) {
                const endDateParam = new Date(endDate);
                query += 'AND end_date <= $/endDate/ ';
                params['endDate'] = endDateParam;
            }
            if (guestId) {
                // check if the guest exists
                const parsedGuestId = parseInt(guestId);
                if (isNaN(parsedGuestId)) {
                    return (0, sendResponse_1.default)(res, {
                        success: false,
                        statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                        message: strings_1.default.api.guest.invalidGuestId(parsedGuestId),
                        data: null,
                    });
                }
                const guestExists = yield checkGuestExistsById(parsedGuestId);
                if (!guestExists) {
                    return (0, sendResponse_1.default)(res, {
                        success: false,
                        statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                        message: strings_1.default.api.guest.guestNotFound(parsedGuestId),
                        data: null,
                    });
                }
                query += 'AND guest_id = $/guestId/ ';
                params['guestId'] = guestId;
            }
            // check if any query is provided
            if (Object.keys(params).length === 0) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.generic.invalidQuery,
                    data: null,
                });
            }
            const reservations = yield db.any(query, params);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: reservations,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/reservations/guest/:guestId
     * Get reservation by id
     */
    router.get("/:reservationId", authentication, authorization("reservations.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservationId = parseInt(req.params.reservationId);
            if (isNaN(reservationId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.reservations.invalidReservationId(reservationId),
                    data: null
                });
            }
            const reservation = yield getReservationById(reservationId);
            if (reservation === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.reservations.reservationNotFound(reservationId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: reservation,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/reservations/guest/:guestId
     * Create reservation
     */
    router.post("/add", authentication, authorization("reservations.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                reservationId: joi_1.default.number().optional(),
                roomId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                startDate: joi_1.default.date().required(),
                endDate: joi_1.default.date().required(),
                checkInDate: joi_1.default.date().optional(),
                checkOutDate: joi_1.default.date().optional(),
                reservationStatus: joi_1.default.string().optional().valid(...Object.values(ReservationStatuses_1.ReservationStatuses))
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            // check if the guest exists
            const guestExists = yield checkGuestExistsById(req.body.guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(req.body.guestId),
                    data: null,
                });
            }
            // check if the room exists
            const roomExists = yield checkRoomExistsById(req.body.roomId);
            if (!roomExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.room.roomNotFound(req.body.roomId),
                    data: null,
                });
            }
            //check if reservation is available
            const isAvailable = yield checkIfReservationIsAvailable(req.body.roomId, dayjs.utc(req.body.startDate).toDate(), new dayjs.utc(req.body.endDate).toDate());
            if (!isAvailable) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.reservations.roomUnavailableForDates(req.body.roomId),
                    data: null,
                });
            }
            const startDateParsed = dayjs.utc(req.body.startDate);
            const endDateParsed = dayjs.utc(req.body.endDate);
            // check if the end
            const reservation = {
                reservationId: req.body.reservationId,
                roomId: req.body.roomId,
                guestId: req.body.guestId,
                startDate: startDateParsed.toDate(),
                endDate: endDateParsed.toDate(),
                checkInDate: req.body.checkInDate,
                checkOutDate: req.body.checkOutDate,
                reservationStatus: req.body.reservationStatus
            };
            const newReservation = yield createReservation(reservation);
            log(LogEventTypes_1.LogEventTypes.RESERVATION_CREATE, req.userId, "Created reservation with id: " + newReservation.reservationId + " for guest: " + newReservation.guestId + " with room: " + newReservation.roomId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: newReservation,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/reservations/guest/:guestId
     * Update reservation
     */
    router.patch("/:reservationId", authentication, authorization("reservations.update"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservationId = parseInt(req.params.reservationId);
            if (isNaN(reservationId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.reservations.invalidReservationId(reservationId),
                    data: null,
                });
            }
            // check if reservation exists
            const exists = yield checkReservationExistsById(reservationId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.reservations.reservationNotFound(reservationId),
                    data: null,
                });
            }
            const schema = joi_1.default.object({
                roomId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                startDate: joi_1.default.date().required(),
                endDate: joi_1.default.date().required(),
                checkInDate: joi_1.default.date().optional().allow(null),
                checkOutDate: joi_1.default.date().optional().allow(null),
                reservationStatus: joi_1.default.string().optional().valid(...Object.values(ReservationStatuses_1.ReservationStatuses))
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            // check if the guest exists
            const guestExists = yield checkGuestExistsById(req.body.guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(req.body.guestId),
                    data: null,
                });
            }
            // check room exists
            const roomExists = yield checkRoomExistsById(req.body.roomId);
            if (!roomExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.room.roomNotFound(req.body.roomId),
                    data: null,
                });
            }
            const startDateParsed = dayjs.utc(req.body.startDate).toDate();
            const endDateParsed = dayjs.utc(req.body.endDate).toDate();
            const reservation = {
                reservationId: reservationId,
                roomId: req.body.roomId,
                guestId: req.body.guestId,
                startDate: startDateParsed,
                endDate: endDateParsed,
                checkInDate: req.body.checkInDate,
                checkOutDate: req.body.checkOutDate,
                reservationStatus: req.body.reservationStatus
            };
            const updatedReservation = yield updateReservation(reservation);
            log(LogEventTypes_1.LogEventTypes.RESERVATION_UPDATE, req.userId, "Updated reservation with id: " + reservationId + " for guest: " + req.body.guestId + " with room: " + req.body.roomId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: updatedReservation,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/reservations/guest/:guestId
     * Delete reservation
     */
    router.delete("/:reservationId", authentication, authorization("reservations.delete"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservationId = parseInt(req.params.reservationId);
            if (isNaN(reservationId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.reservations.invalidReservationId(reservationId),
                    data: null,
                });
            }
            // check if reservation exists
            const exists = yield checkReservationExistsById(reservationId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.reservations.reservationNotFound(reservationId),
                    data: null,
                });
            }
            yield deleteReservation(reservationId);
            log(LogEventTypes_1.LogEventTypes.RESERVATION_DELETE, req.userId, "Deleted reservation with id: " + reservationId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports.makeReservationsRoute = makeReservationsRoute;


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReservationStatuses = void 0;
var ReservationStatuses;
(function (ReservationStatuses) {
    ReservationStatuses["PENDING"] = "Pending";
    ReservationStatuses["CONFIRMED"] = "Confirmed";
    ReservationStatuses["CANCELLED"] = "Cancelled";
    ReservationStatuses["CHECKED_IN"] = "Checked In";
    ReservationStatuses["CHECKED_OUT"] = "Checked Out";
})(ReservationStatuses || (exports.ReservationStatuses = ReservationStatuses = {}));


/***/ }),
/* 59 */
/***/ ((module) => {

module.exports = require("dayjs");

/***/ }),
/* 60 */
/***/ ((module) => {

module.exports = require("dayjs/plugin/utc");

/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeRoomsDAO = void 0;
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const pgPromise = __webpack_require__(13);
var QueryResultError = pgPromise.errors.QueryResultError;
var queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
/**
 * Rooms DAO
 * @param db - database object
 */
const makeRoomsDAO = (db) => {
    /**
     * Get all rooms
     * @returns rooms, empty array if no rooms
     */
    const getRooms = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.any(queries_1.default.rooms.getRooms);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Get room by id
     * @param roomId
     * @returns room, null if no room
     */
    const getRoomById = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.oneOrNone(queries_1.default.rooms.getRoomById, [roomId]);
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            }
            else {
                throw err;
            }
        }
    });
    /**
     * Check if room exists by id
     * @param roomId
     * @returns boolean
     */
    const checkRoomExistsById = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.rooms.checkRoomExistsById, [roomId]);
        return exists.exists;
    });
    /**
     * Check if room exists by room code
     * @param roomCode
     * @returns boolean
     */
    const checkRoomExistsByRoomCode = (roomCode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.rooms.checkRoomExistsByRoomCode, [roomCode]);
        return exists.exists;
    });
    /**
     * Create room
     * @param room
     * @returns room
     */
    const createRoom = (room) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.rooms.addRoom, [room.roomCode, room.pricePerNight, room.description, room.status]);
    });
    /**
     * Update room
     * @param room
     * @returns room
     */
    const updateRoom = (room) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.rooms.updateRoom, [room.roomCode, room.pricePerNight, room.description, room.status, room.roomId]);
    });
    /**
     * Delete room
     * @param roomId
     * @returns void
     */
    const deleteRoom = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.rooms.deleteRoom, [roomId]);
    });
    /**
     * Search rooms by room code
     * @param roomCode
     * @returns rooms, empty array if no rooms
     */
    const searchRoomsByRoomCode = (roomCode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.rooms.searchRooms, [roomCode]);
    });
    /**
     * Get room status count
     * @returns room status count
     */
    const getRoomStatusCount = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.rooms.getStatusCount);
    });
    /**
     * Get reservations by room id
     * @param roomId
     * @returns reservations, empty array if no reservations
     */
    const getReservationsByRoomId = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.rooms.getReservationsByRoomId, [roomId]);
    });
    return {
        getRooms,
        getRoomById,
        createRoom,
        checkRoomExistsById,
        updateRoom,
        deleteRoom,
        checkRoomExistsByRoomCode,
        searchRoomsByRoomCode,
        getRoomStatusCount,
        getReservationsByRoomId
    };
};
exports.makeRoomsDAO = makeRoomsDAO;


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makePaymentMethodsDAO = void 0;
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
/**
 * Payment methods DAO
 * @param db - database object
 */
const makePaymentMethodsDAO = (db) => {
    /**
     * Get all payment methods
     */
    const getPaymentMethods = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.paymentMethods.getPaymentMethods);
    });
    /**
     * Get payment method by id
     * @param paymentMethodId
     * @returns payment method, null if no payment method
     */
    const getPaymentMethodById = (paymentMethodId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.one(queries_1.default.paymentMethods.getPaymentMethodById, [paymentMethodId]);
        }
        catch (error) {
            if (error instanceof QueryResultError && error.code === pg_promise_1.default.errors.queryResultErrorCode.noData) {
                return null;
            }
            throw error;
        }
    });
    /**
     * Add payment method
     * @param paymentMethod
     * @returns payment method
     */
    const addPaymentMethod = (paymentMethod) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.paymentMethods.addPaymentMethod, [paymentMethod.guestId, paymentMethod.type, paymentMethod.cardNumber, paymentMethod.cardCVV, paymentMethod.cardExpiration, paymentMethod.cardHolderName, paymentMethod.bankAccountNumber, paymentMethod.bankBSB]);
    });
    /**
     * Update payment method
     * @param paymentMethod
     * @returns payment method
     */
    const updatePaymentMethod = (paymentMethod) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.paymentMethods.updatePaymentMethod, [paymentMethod.guestId, paymentMethod.type, paymentMethod.cardNumber, paymentMethod.cardCVV, paymentMethod.cardExpiration, paymentMethod.cardHolderName, paymentMethod.bankAccountNumber, paymentMethod.bankBSB, paymentMethod.paymentMethodId]);
    });
    /**
     * Delete payment method
     * @param paymentMethodId
     * @returns void
     */
    const deletePaymentMethod = (paymentMethodId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.paymentMethods.deletePaymentMethod, [paymentMethodId]);
    });
    /**
     * Check if payment method exists by id
     * @param paymentMethodId
     * @returns boolean
     */
    const checkPaymentMethodExistsById = (paymentMethodId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.paymentMethods.checkPaymentMethodExistsById, [paymentMethodId]);
        return exists.exists;
    });
    return {
        getPaymentMethods,
        getPaymentMethodById,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        checkPaymentMethodExistsById,
    };
};
exports.makePaymentMethodsDAO = makePaymentMethodsDAO;


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makePaymentMethodRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const PaymentMethodTypes_1 = __webpack_require__(64);
const LogEventTypes_1 = __webpack_require__(23);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
/**
 * Payment Method Route
 * @param paymentMethodsDAO - payment methods DAO
 * @param guestsDAO - guests DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makePaymentMethodRoute = (paymentMethodsDAO, guestsDAO, log, authentication, authorization) => {
    const { getPaymentMethods, getPaymentMethodById, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, checkPaymentMethodExistsById, } = paymentMethodsDAO;
    const { checkGuestExistsById, } = guestsDAO;
    const router = express_1.default.Router();
    /**
     * HTTP GET /api/payment-methods
     * Get all payment methods
     */
    router.get("/", authentication, authorization("paymentMethods.read"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const paymentMethods = yield getPaymentMethods();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: paymentMethods,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/payment-methods/:paymentMethodId
     * Add a payment method
     */
    router.post("/add", authentication, authorization("paymentMethods.write"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                guestId: joi_1.default.number().required(),
                type: joi_1.default.string().required().valid(...Object.values(PaymentMethodTypes_1.PaymentMethodTypes)),
                cardNumber: joi_1.default.string().creditCard().optional().allow("", null),
                cardCVV: joi_1.default.string().optional().allow("", null),
                cardExpiration: joi_1.default.date().optional().allow("", null),
                cardHolderName: joi_1.default.string().optional().allow("", null),
                bankAccountNumber: joi_1.default.string().optional().allow("", null),
                bankBSB: joi_1.default.string().optional().allow("", null),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            if (req.body.cardCVV && req.body.cardCVV.length !== 3) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.paymentMethods.invalidCardCVV,
                    data: null,
                });
            }
            // check if guest exists
            const guestId = yield checkGuestExistsById(req.body.guestId);
            if (!guestId) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(req.body.guestId),
                    data: null,
                });
            }
            const paymentMethod = yield addPaymentMethod(req.body);
            log(LogEventTypes_1.LogEventTypes.PAYMENT_METHOD_CREATE, req.userId, "Created a new payment method for guest: " + req.body.guestId + " with type: " + req.body.type);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: paymentMethod,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/payment-methods/:paymentMethodId
     * Update payment method id
     */
    router.patch("/:paymentMethodId", authentication, authorization("paymentMethods.write"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                paymentMethodId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                type: joi_1.default.string().required().valid(Object.assign({}, Object.values(PaymentMethodTypes_1.PaymentMethodTypes))),
                cardNumber: joi_1.default.string().creditCard().optional().allow("", null),
                cardCVV: joi_1.default.string().optional().allow("", null),
                cardExpiration: joi_1.default.date().optional().allow("", null),
                cardHolderName: joi_1.default.string().optional().allow("", null),
                bankAccountNumber: joi_1.default.string().optional().allow("", null),
                bankBSB: joi_1.default.string().optional().allow("", null),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            // check if the payment method exists
            const paymentMethodId = yield checkPaymentMethodExistsById(req.body.paymentMethodId);
            if (!paymentMethodId) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.paymentMethods.paymentMethodNotFound(req.body.paymentMethodId),
                    data: null,
                });
            }
            // check if guest exists
            const guestId = yield checkGuestExistsById(req.body.guestId);
            if (!guestId) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(req.body.guestId),
                    data: null,
                });
            }
            const paymentMethod = yield updatePaymentMethod(req.body);
            log(LogEventTypes_1.LogEventTypes.PAYMENT_METHOD_UPDATE, req.userId, "Updated payment method with id: " + req.body.paymentMethodId + " for guest: " + req.body.guestId + " with type: " + req.body.type);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: paymentMethod,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP DELETE /api/payment-methods/:paymentMethodId
     * Delete payment method by id
     */
    router.delete("/:paymentMethodId", authentication, authorization("paymentMethods.delete"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.paymentMethodId);
            if (isNaN(id)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.paymentMethods.invalidPaymentMethodId(id),
                    data: null,
                });
            }
            const paymentMethodExists = yield checkPaymentMethodExistsById(id);
            if (!paymentMethodExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.paymentMethods.paymentMethodNotFound(id),
                    data: null,
                });
            }
            yield deletePaymentMethod(id);
            log(LogEventTypes_1.LogEventTypes.PAYMENT_METHOD_DELETE, req.userId, "Deleted payment method with id: " + id);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports.makePaymentMethodRoute = makePaymentMethodRoute;


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaymentMethodTypes = void 0;
var PaymentMethodTypes;
(function (PaymentMethodTypes) {
    PaymentMethodTypes["CREDIT_CARD"] = "Credit Card";
    PaymentMethodTypes["BANK_ACCOUNT"] = "Bank Account";
})(PaymentMethodTypes || (exports.PaymentMethodTypes = PaymentMethodTypes = {}));


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeTransactionsDAO = void 0;
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
/**
 * Transaction DAO
 * @param db - database object
 */
const makeTransactionsDAO = (db) => {
    /**
     * Get all transactions
     * @returns transactions, empty array if no transactions
     */
    const getTransactions = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.transactions.getTransactions);
    });
    /**
     * Get transaction by id
     * @param transactionId
     * @returns transaction, null if no transaction
     */
    const getTransaction = (transactionId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.one(queries_1.default.transactions.getTransactionById, [transactionId]);
        }
        catch (e) {
            if (e instanceof QueryResultError && e.code === pg_promise_1.default.errors.queryResultErrorCode.noData) {
                throw new Error(`Transaction ${transactionId} not found!`);
            }
            throw e;
        }
    });
    /**
     * Create transaction
     * @param transaction
     * @returns transaction
     */
    const createTransaction = (transaction) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.transactions.addTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date]);
    });
    /**
     * Update transaction
     * @param transaction
     * @returns transaction
     */
    const updateTransaction = (transaction) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.transactions.updateTransaction, [transaction.paymentMethodId, transaction.guestId, transaction.amount, transaction.description, transaction.date, transaction.transactionId]);
    });
    /**
     * Delete transaction
     * @param transactionId
     * @returns transaction
     */
    const deleteTransaction = (transactionId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.none(queries_1.default.transactions.deleteTransaction, [transactionId]);
    });
    /**
     * Check if transaction exists by id
     * @param transactionId
     * @returns boolean
     */
    const checkTransactionExistsById = (transactionId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const exists = yield db.one(queries_1.default.transactions.checkTransactionExistsById, [transactionId]);
        return exists.exists;
    });
    return {
        getTransactions,
        getTransaction,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        checkTransactionExistsById
    };
};
exports.makeTransactionsDAO = makeTransactionsDAO;


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeTransactionsRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const LogEventTypes_1 = __webpack_require__(23);
const dayjs_1 = tslib_1.__importDefault(__webpack_require__(59));
/**
 * Transaction Route
 * @param transactionsDAO - transactions DAO
 * @param guestDAO - guest DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeTransactionsRoute = (transactionsDAO, guestDAO, log, authentication, authorization) => {
    const router = express_1.default.Router();
    const { getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction, checkTransactionExistsById } = transactionsDAO;
    const { getPaymentMethodsByGuestId, checkGuestExistsById } = guestDAO;
    /**
     * HTTP GET /api/transactions
     * Get all transactions
     */
    router.get('/', authentication, authorization('transactions.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const transactions = yield getTransactions();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: transactions
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP GET /api/transactions/:transactionId
     * Get transaction by id
     */
    router.get('/:transactionId', authentication, authorization('transactions.read'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const transactionId = parseInt(req.params.transactionId);
            if (isNaN(transactionId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.transactions.invalidTransactionId(req.params.transactionId),
                    data: null
                });
            }
            // check if transaction exists
            const exists = checkTransactionExistsById(transactionId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.transactions.transactionNotFound(transactionId),
                    data: null
                });
            }
            const transaction = yield getTransaction(transactionId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: transaction
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST /api/transactions/add
     * Create transaction
     */
    router.post('/add', authentication, authorization('transactions.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                paymentMethodId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                amount: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                date: joi_1.default.date().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: error
                });
            }
            // check if the guest exists
            const exists = checkGuestExistsById(req.body.guestId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(req.body.guestId),
                    data: null
                });
            }
            // check if the payment method exists and belongs to the guest
            const paymentMethods = yield getPaymentMethodsByGuestId(req.body.guestId);
            if (!paymentMethods.some(paymentMethod => paymentMethod.paymentMethodId === req.body.paymentMethodId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.paymentMethods.paymentMethodNotFound(req.body.paymentMethodId),
                    data: null
                });
            }
            const parsedDate = dayjs_1.default.utc(req.body.date).toDate();
            const newTransaction = {
                paymentMethodId: req.body.paymentMethodId,
                guestId: req.body.guestId,
                amount: req.body.amount,
                description: req.body.description,
                date: parsedDate
            };
            const createdTransaction = yield createTransaction(newTransaction);
            log(LogEventTypes_1.LogEventTypes.TRANSACTION_CREATE, req.userId, "Created a new transaction for guest: " + req.body.guestId + " with amount: " + req.body.amount);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: createdTransaction
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP PATCH /api/transactions/:transactionId
     * Update transaction
     */
    router.patch('/:transactionId', authentication, authorization('transactions.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                paymentMethodId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                amount: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                date: joi_1.default.date().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: error
                });
            }
            const transactionId = parseInt(req.params.transactionId);
            if (isNaN(transactionId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.transactions.invalidTransactionId(req.params.transactionId),
                    data: null
                });
            }
            // check if the guest exists
            const exists = checkGuestExistsById(req.body.guestId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.guest.guestNotFound(req.body.guestId),
                    data: null
                });
            }
            // check if the payment method exists and belongs to the guest
            const paymentMethods = yield getPaymentMethodsByGuestId(req.body.guestId);
            if (!paymentMethods.some(paymentMethod => paymentMethod.paymentMethodId === req.body.paymentMethodId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.paymentMethods.paymentMethodNotFound(req.body.paymentMethodId),
                    data: null
                });
            }
            const updatedTransaction = {
                transactionId: transactionId,
                paymentMethodId: req.body.paymentMethodId,
                guestId: req.body.guestId,
                amount: req.body.amount,
                description: req.body.description,
                date: req.body.date
            };
            const updated = yield updateTransaction(updatedTransaction);
            log(LogEventTypes_1.LogEventTypes.TRANSACTION_UPDATE, req.userId, "Updated transaction with id: " + transactionId + " for guest: " + req.body.guestId + " with amount: " + req.body.amount);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: updated
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP DELETE /api/transactions/:transactionId
     * Delete transaction
     */
    router.delete('/:transactionId', authentication, authorization('transactions.write'), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const transactionId = parseInt(req.params.transactionId);
            if (isNaN(transactionId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.transactions.invalidTransactionId(req.params.transactionId),
                    data: null
                });
            }
            const exists = checkTransactionExistsById(transactionId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.transactions.transactionNotFound(transactionId),
                    data: null
                });
            }
            yield deleteTransaction(transactionId);
            log(LogEventTypes_1.LogEventTypes.TRANSACTION_DELETE, req.userId, "Deleted transaction with id: " + transactionId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports.makeTransactionsRoute = makeTransactionsRoute;


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeNotesDAO = void 0;
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
/**
 * Notes DAO
 * @param db - database object
 */
const makeNotesDAO = (db) => {
    /**
     * Get note by date
     * @param day - date
     * @returns - note object
     */
    const getNoteByDate = (day) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const isoDate = day.toISOString();
        return yield db.manyOrNone(queries_1.default.notes.getNoteById, [isoDate]);
    });
    /**
     * Add note to date
     * @param noteObj - note object
     * @returns - note object
     */
    const addNoteToDate = (noteObj) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.notes.addNote, [noteObj.date, noteObj.note]);
    });
    /**
     * Delete note
     * @param noteId - note id
     * @returns - void
     */
    const deleteNote = (noteId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.notes.deleteNote, [noteId]);
    });
    /**
     * Check if note exists by id
     * @param noteId - note id
     * @returns - boolean
     */
    const checkNoteExistsById = (noteId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const note = yield db.one(queries_1.default.notes.checkNoteExistsById, [noteId]);
        return note.exists;
    });
    /**
     * Update note
     * @param noteObj
     * @returns - note object
     */
    const updateNote = (noteObj) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.notes.updateNote, [noteObj.note, noteObj.noteId]);
    });
    return {
        getNoteByDate,
        addNoteToDate,
        deleteNote,
        checkNoteExistsById,
        updateNote,
    };
};
exports.makeNotesDAO = makeNotesDAO;


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeCalendarRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const LogEventTypes_1 = __webpack_require__(23);
const dayjs_1 = tslib_1.__importDefault(__webpack_require__(59));
__webpack_require__(60);
/**
 * Calendar Route
 * @param calendarDAO - calendar DAO
 * @param log - db event logger
 * @param authentication - authentication middleware
 * @param authorization - authorization middleware
 */
const makeCalendarRoute = (calendarDAO, log, authentication, authorization) => {
    const { getNoteByDate, addNoteToDate, checkNoteExistsById, updateNote } = calendarDAO;
    const router = express_1.default.Router();
    /**
     * HTTP GET /api/calendar/:date
     * Get note by date
     */
    router.get("/:date", authentication, authorization("calendar.get"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const date = req.params.date;
            const parsedDate = dayjs_1.default.utc(date).toDate();
            const note = yield getNoteByDate(parsedDate);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: note,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP POST /api/calendar/add
     * Add note to date
     */
    router.post("/add", authentication, authorization("calendar.add"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                date: joi_1.default.date().required(),
                note: joi_1.default.string().required(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            const parsedDate = dayjs_1.default.utc(req.body.date).toDate();
            const newNote = {
                date: parsedDate,
                note: req.body.note,
            };
            const note = yield addNoteToDate(newNote);
            log(LogEventTypes_1.LogEventTypes.CALENDAR_NOTE_CREATE, req.userId, "Created a new note for date: " + req.body.date + " with note: " + req.body.note);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.generic.success,
                data: note,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP PATCH /api/calendar/:noteId
     * Update note
     */
    router.patch("/:noteId", authentication, authorization("calendar.edit"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const noteId = parseInt(req.params.noteId);
            if (isNaN(noteId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.notes.invalidNoteId(noteId),
                    data: null,
                });
            }
            // check if note exists
            const noteExists = yield checkNoteExistsById(noteId);
            if (!noteExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.notes.noteNotFound(noteId),
                    data: null,
                });
            }
            const schema = joi_1.default.object({
                date: joi_1.default.date().required(),
                note: joi_1.default.string().required(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            const parsedDate = dayjs_1.default.utc(req.body.date).toDate();
            const updatedNote = {
                noteId: noteId,
                date: parsedDate,
                note: req.body.note,
            };
            const note = yield updateNote(updatedNote);
            log(LogEventTypes_1.LogEventTypes.CALENDAR_NOTE_UPDATE, req.userId, "Updated note with id: " + noteId + " to date: " + req.body.date + " with note: " + req.body.note);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: note,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * HTTP DELETE /api/calendar/:noteId
     * Delete note
     */
    router.delete("/:noteId", authentication, authorization("calendar.delete"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const noteId = parseInt(req.params.noteId);
            if (isNaN(noteId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.notes.invalidNoteId(noteId),
                    data: null,
                });
            }
            // check if note exists
            const noteExists = yield checkNoteExistsById(noteId);
            if (!noteExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.notes.noteNotFound(noteId),
                    data: null,
                });
            }
            yield calendarDAO.deleteNote(noteId);
            log(LogEventTypes_1.LogEventTypes.CALENDAR_NOTE_DELETE, req.userId, "Deleted note with id: " + noteId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.generic.success,
                data: null,
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports.makeCalendarRoute = makeCalendarRoute;


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeTicketsDAO = void 0;
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
/**
 * Tickets DAO
 * @param db - database object
 */
const makeTicketsDAO = (db) => {
    /**
     * Get ticket by id
     * @param id
     * @returns ticket, null if no ticket
     */
    const getTicketById = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield db.one(queries_1.default.tickets.getTicketById, [id]);
        }
        catch (error) {
            if (error instanceof QueryResultError && error.code === pg_promise_1.default.errors.queryResultErrorCode.noData) {
                return null;
            }
            throw error;
        }
    });
    /**
     * Add ticket
     * @param ticket
     * @returns ticket
     */
    const addTicket = (ticket) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.tickets.addTicket, [ticket.userId, ticket.title, ticket.description, ticket.status, ticket.dateOpened]);
    });
    /**
     * Update ticket
     * @param ticket
     * @returns ticket
     */
    const updateTicket = (ticket) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.tickets.updateTicket, [ticket.userId, ticket.title, ticket.description, ticket.status, ticket.dateOpened, ticket.ticketId]);
    });
    /**
     * Delete ticket
     * @param id
     * @returns void
     */
    const deleteTicket = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.tickets.deleteTicket, [id]);
    });
    /**
     * Get all tickets
     * @returns tickets, empty array if no tickets
     */
    const getAllTickets = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.tickets.getAllTickets);
    });
    /**
     * Add comment to ticket
     * @param ticketMessage
     * @returns ticket message
     */
    const addCommentToTicket = (ticketMessage) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.one(queries_1.default.tickets.addCommentToTicket, [ticketMessage.ticketId, ticketMessage.userId, ticketMessage.message, ticketMessage.dateCreated]);
    });
    /**
     * Check if ticket exists by id
     * @param id
     * @returns boolean
     */
    const checkTicketExistsById = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.one(queries_1.default.tickets.checkTicketExistsById, [id]);
        return result.exists;
    });
    /**
     * Get ticket comments
     * @param ticketId
     * @returns ticket comments, empty array if no comments
     */
    const getTicketComments = (ticketId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return yield db.any(queries_1.default.tickets.fetchTicketComments, [ticketId]);
    });
    /**
     * Delete ticket comments by ticket id
     * @param ticketId
     * @returns void
     */
    const deleteTicketCommentsByTicketId = (ticketId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield db.none(queries_1.default.tickets.deleteTicketCommentsByTicketId, [ticketId]);
    });
    return {
        getTicketById,
        addTicket,
        updateTicket,
        deleteTicket,
        getAllTickets,
        addCommentToTicket,
        checkTicketExistsById,
        getTicketComments,
        deleteTicketCommentsByTicketId
    };
};
exports.makeTicketsDAO = makeTicketsDAO;


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeTicketsRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const models_1 = __webpack_require__(25);
const LogEventTypes_1 = __webpack_require__(23);
const dayjs_1 = tslib_1.__importDefault(__webpack_require__(59));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const makeTicketsRoute = (ticketsDAO, usersDAO, log, authentication, authorization) => {
    const router = express_1.default.Router();
    const { addCommentToTicket, addTicket, deleteTicket, getAllTickets, getTicketById, updateTicket, checkTicketExistsById, getTicketComments, deleteTicketCommentsByTicketId } = ticketsDAO;
    const { checkUserExists, checkUserExistsById, createUser, deleteUser, getUserById, getUserByUsername, getUsers, searchUsers, updateUser } = usersDAO;
    /**
     * Get all tickets-page
     */
    router.get("/", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const tickets = yield getAllTickets();
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: tickets,
                message: strings_1.default.api.generic.success,
                statusCode: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * Get ticket comments
     */
    router.get("/:ticketId/comments", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const ticketId = parseInt(req.params.ticketId);
            if (isNaN(ticketId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.invalidTicketId(req.params.ticketId),
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            const ticketExists = yield checkTicketExistsById(ticketId);
            if (!ticketExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.ticketNotFound(ticketId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            const comments = yield getTicketComments(ticketId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: comments,
                message: strings_1.default.api.generic.success,
                statusCode: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * Add comment to ticket
     */
    router.post("/:ticketId/comments/add", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const ticketId = parseInt(req.params.ticketId);
            if (isNaN(ticketId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.invalidTicketId(req.params.ticketId),
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            const schema = joi_1.default.object({
                userId: joi_1.default.number().required(),
                message: joi_1.default.string().required(),
                dateCreated: joi_1.default.date().required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: error.message,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            // Check if ticket exists
            const ticketExists = yield checkTicketExistsById(ticketId);
            if (!ticketExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.ticketNotFound(ticketId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            // Check if user exists
            const userExists = yield checkUserExistsById(req.body.userId);
            if (!userExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.users.userNotFound(req.body.userId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            const parsedDate = dayjs_1.default.utc(req.body.dateCreated).toDate();
            const newTicketMessage = {
                ticketId: ticketId,
                userId: req.body.userId,
                message: req.body.message,
                dateCreated: parsedDate
            };
            const message = yield addCommentToTicket(newTicketMessage);
            log(LogEventTypes_1.LogEventTypes.TICKET_COMMENT_CREATE, req.userId, "Added a new comment to ticket with id: " + ticketId + " with message: " + req.body.message);
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: message,
                message: strings_1.default.api.generic.success,
                statusCode: http_status_codes_1.StatusCodes.CREATED
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * Get Ticket by ID
     */
    router.get("/:ticketId", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const ticketId = parseInt(req.params.ticketId);
            if (isNaN(ticketId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.invalidTicketId(req.params.ticketId),
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            const ticket = yield getTicketById(ticketId);
            if (ticket === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.ticketNotFound(ticketId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: ticket,
                message: "Success",
                statusCode: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * Create a new ticket
     */
    router.post("/add", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                userId: joi_1.default.number().required(),
                title: joi_1.default.string().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required().valid(...Object.values(models_1.TicketStatuses)),
                dateOpened: joi_1.default.date().required()
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: error.message,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            // Check if user exists
            const userExists = yield checkUserExistsById(value.userId);
            if (!userExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.users.userNotFound(value.userId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            const ticket = yield addTicket(value);
            log(LogEventTypes_1.LogEventTypes.TICKET_CREATE, req.userId, "Created a new ticket with title: " + req.body.title + " and description: " + req.body.description);
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: ticket,
                message: strings_1.default.api.generic.success,
                statusCode: http_status_codes_1.StatusCodes.CREATED
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * Update a ticket
     */
    router.patch("/:ticketId", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const ticketId = parseInt(req.params.ticketId);
            if (isNaN(ticketId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.invalidTicketId(req.params.ticketId),
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            const schema = joi_1.default.object({
                userId: joi_1.default.number().required(),
                title: joi_1.default.string().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required().valid(...Object.values(models_1.TicketStatuses)),
                dateOpened: joi_1.default.date().required()
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: error.message,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            // check if ticket exists
            const ticketExists = yield checkTicketExistsById(ticketId);
            if (!ticketExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.ticketNotFound(ticketId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            // check if user exists
            const userExists = yield checkUserExistsById(value.userId);
            if (!userExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.users.userNotFound(value.userId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            const updatedTicket = {
                ticketId: ticketId,
                userId: value.userId,
                title: value.title,
                description: value.description,
                status: value.status,
                dateOpened: value.dateOpened
            };
            const ticket = yield updateTicket(updatedTicket);
            log(LogEventTypes_1.LogEventTypes.TICKET_UPDATE, req.userId, "Updated ticket with id: " + ticketId + " with title: " + req.body.title + " and description: " + req.body.description);
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: ticket,
                message: strings_1.default.api.generic.success,
                statusCode: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (e) {
            next(e);
        }
    }));
    /**
     * Delete a ticket
     */
    router.delete("/:ticketId", authentication, authorization("tickets-page.create"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const ticketId = parseInt(req.params.ticketId);
            if (isNaN(ticketId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.invalidTicketId(req.params.ticketId),
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            // check if ticket exists
            const ticketExists = yield checkTicketExistsById(ticketId);
            if (!ticketExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    data: null,
                    message: strings_1.default.api.tickets.ticketNotFound(ticketId),
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            yield deleteTicket(ticketId);
            log(LogEventTypes_1.LogEventTypes.TICKET_DELETE, req.userId, "Deleted ticket with id: " + ticketId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                data: null,
                message: strings_1.default.api.generic.success,
                statusCode: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (e) {
            next(e);
        }
    }));
    return {
        router
    };
};
exports.makeTicketsRoute = makeTicketsRoute;


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeEventLogger = void 0;
const tslib_1 = __webpack_require__(1);
/**
 * Event Logger to log events to the database
 * @param logsDAO - logs DAO
 */
const makeEventLogger = (logsDAO) => {
    /**
     * Log an event to the database
     * @param eventType - event type
     * @param userId - user id
     * @param description - description
     */
    return (eventType, userId, description) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield logsDAO.addLog({
                eventType: eventType,
                timestamp: new Date(),
                userId: userId,
                description: description
            });
        }
        catch (error) {
            throw error;
        }
    });
};
exports.makeEventLogger = makeEventLogger;


/***/ }),
/* 72 */
/***/ ((module) => {

module.exports = require("os");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.config = void 0;
const tslib_1 = __webpack_require__(1);
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
const config_1 = tslib_1.__importDefault(__webpack_require__(2));
const startServer_1 = tslib_1.__importDefault(__webpack_require__(5));
const logger_1 = __webpack_require__(6);
const os_1 = tslib_1.__importDefault(__webpack_require__(72));
const path_1 = tslib_1.__importDefault(__webpack_require__(43));
const config = (0, config_1.default)();
exports.config = config;
// check if command line arguments were passed
if (process.argv.length > 2) {
    // load config from command line arguments
    config.loadFromArgs(process.argv.slice(2))
        .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const server = yield (0, startServer_1.default)(config.getConfig());
        return server.start();
    }))
        .catch((err) => {
        logger_1.logger.fatal(err);
        process.exit(1);
    });
}
else {
    // load config from file
    const homedir = os_1.default.homedir();
    const configPath = path_1.default.join(homedir, '.config', 'hotel-management-system-backend', 'server-config.json');
    logger_1.logger.info(`Loading config from ${configPath}`);
    config.loadFromFile(configPath)
        .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info("Loaded config");
        const server = yield (0, startServer_1.default)(config.getConfig());
        return server.start();
    }))
        .catch((err) => {
        logger_1.logger.fatal(err);
        process.exit(1);
    });
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map