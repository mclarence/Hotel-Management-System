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
const roomsRoute_1 = __webpack_require__(23);
const path_1 = tslib_1.__importDefault(__webpack_require__(24));
const users_1 = tslib_1.__importDefault(__webpack_require__(25));
const roles_1 = tslib_1.__importDefault(__webpack_require__(26));
const tokens_1 = tslib_1.__importDefault(__webpack_require__(27));
const authentication_1 = tslib_1.__importDefault(__webpack_require__(28));
const authorization_1 = tslib_1.__importDefault(__webpack_require__(29));
const process = tslib_1.__importStar(__webpack_require__(31));
const hashPassword_1 = tslib_1.__importDefault(__webpack_require__(17));
const rolesRoute_1 = tslib_1.__importDefault(__webpack_require__(32));
const guests_1 = tslib_1.__importDefault(__webpack_require__(33));
const guestsRoute_1 = tslib_1.__importDefault(__webpack_require__(34));
const reservations_1 = __webpack_require__(35);
const reservationsRoute_1 = __webpack_require__(36);
const rooms_1 = __webpack_require__(37);
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
    const guestsDAO = (0, guests_1.default)(db.db);
    const reservationsDAO = (0, reservations_1.makeReservationDAO)(db.db);
    const tokenRevocationListDAO = (0, tokens_1.default)(db.db);
    const roomsDAO = (0, rooms_1.makeRoomsDAO)(db.db);
    yield createDefaultRoleAndAdmin(rolesDAO, usersDAO);
    const authenticationMiddleware = (0, authentication_1.default)(serverOptions.jwt.secret, tokenRevocationListDAO);
    const authorizationMiddleware = (0, authorization_1.default)(rolesDAO);
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(logger_1.expressLogger);
    const usersRoute = (0, usersRoute_1.default)(usersDAO, rolesDAO, tokenRevocationListDAO, authenticationMiddleware, authorizationMiddleware, serverOptions.jwt.secret);
    const rolesRoute = (0, rolesRoute_1.default)(rolesDAO, authenticationMiddleware, authorizationMiddleware);
    const guestsRoute = (0, guestsRoute_1.default)(guestsDAO, authenticationMiddleware, authorizationMiddleware);
    const reservationsRoute = (0, reservationsRoute_1.makeReservationsRoute)(reservationsDAO, guestsDAO, authenticationMiddleware, authorizationMiddleware);
    const roomsRoute = (0, roomsRoute_1.makeRoomsRoute)(roomsDAO, authenticationMiddleware, authorizationMiddleware);
    app.use("/api/users", usersRoute.router);
    app.use("/api/roles", rolesRoute.router);
    app.use("/api/rooms", roomsRoute.router);
    app.use("/api/guests", guestsRoute.router);
    app.use("/api/reservations", reservationsRoute.router);
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
        next();
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
const createDatabase = (options) => {
    const pgp = (0, pg_promise_1.default)({
        receive(e) {
            (0, camelizeColumns_1.camelizeColumns)(e.data);
        }
    });
    const db = pgp({
        host: options.database.host,
        port: options.database.port,
        database: options.database.database,
        user: options.database.user,
        password: options.database.password
    });
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
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id)
            );
        `,
    },
    roles: {
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
            SELECT * FROM users WHERE username = $1
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
            SELECT * FROM users
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
            SELECT * FROM reservations
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
            SET room_id = $1, guest_id = $2, start_date = $3, end_date = $4
            WHERE reservation_id = $5
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
const makeUsersRoute = (usersDAO, rolesDAO, tokenRevocationListDAO, authentication, authorization, jwtSecret) => {
    const router = express_1.default.Router();
    const { getUsers, getUserById, getUserByUsername, createUser, checkUserExists, checkUserExistsById, deleteUser, updateUser, searchUsers } = usersDAO;
    const { checkRoleExists } = rolesDAO;
    const { revokeToken } = tokenRevocationListDAO;
    /**
     * HTTP GET - /api/users
     * Get all users
     * Requires users.read permission
     */
    router.get('/', authentication, authorization('users.read'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield getUsers();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: users
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    router.get('/me', authentication, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield getUserById(req.userId);
            // if the user is null, return 404
            if (user === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.userIdNotFound(req.userId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: user
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * HTTP GET - /api/users/:userId
     * Get a user by id
     * Requires users.read permission
     */
    router.get('/:userId', authentication, authorization('users.read'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.invalidUserId,
                    data: null
                });
            }
            const user = yield getUserById(userId);
            // if the user is null, return 404
            if (user === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.userIdNotFound(userId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: user
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * HTTP POST - /api/users/add
     * Create a new user
     */
    router.post('/add', authentication, authorization('users.write'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
                    message: strings_1.default.api.userConflict(req.body.username),
                    data: null
                });
            }
            if (!(yield checkRoleExists(req.body.roleId))) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.roleIdNotFound(req.body.roleId),
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
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.success,
                data: user
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * HTTP DELETE - /api/users/:userId
     * Delete a user by userId
     */
    router.delete('/:userId', authentication, authorization('users.delete'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            //check if the user is trying to delete themselves
            if (userId === req['userId']) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.cannotDeleteSelf,
                    data: null
                });
            }
            if (isNaN(userId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.invalidUserId,
                    data: null
                });
            }
            // check if the user exists
            if (!(yield checkUserExistsById(userId))) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.userIdNotFound(userId),
                    data: null
                });
            }
            yield deleteUser(userId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: null
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * HTTP POST - /api/users/login
     * Login a user
     */
    router.post('/login', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
                    message: strings_1.default.api.usernameNotFound(req.body.username),
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
                    message: strings_1.default.api.incorrectPassword,
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
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.loginSuccessful,
                data: {
                    jwt: jwtToken
                }
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * HTTP POST - /api/users/logout
     * Logout a user by revoking the token.
     */
    router.post('/logout', authentication, (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (token === undefined) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.tokenInvalid,
                    data: null
                });
            }
            yield revokeToken(token);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.loggedOut,
                data: null
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * HTTP PATCH - /api/users/:userId
     * Update user properties by userId
     */
    router.patch('/:userId', authentication, authorization('users.write'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.invalidUserId,
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
                    message: strings_1.default.api.userIdNotFound(userId),
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
                            message: strings_1.default.api.userConflict(req.body.username),
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
                            message: strings_1.default.api.roleIdNotFound(req.body.roleId),
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
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: updatedUser
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    router.get("/search", authentication, authorization('users.read'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = req.query.q;
            if (query === undefined) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.queryNotProvided,
                    data: null
                });
            }
            const users = yield searchUsers(query.toString());
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: users
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
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
        success: "Success",
        serverError: "The server encountered an internal error. Please try again later.",
        unauthorized: "You are not authorized to perform this action.",
        unauthenticated: "This action requires authentication.",
        cannotDeleteSelf: "You cannot delete yourself.",
        missingField: (fieldName) => `The request body is missing the required field: ${fieldName}`,
        tokenInvalid: "The provided token is invalid.",
        invalidUserId: "The provided userId is invalid.",
        userIdNotFound: (userId) => `User with userId ${userId} not found.`,
        usernameNotFound: (username) => `User with username ${username} not found.`,
        userConflict: (username) => `User with username ${username} already exists.`,
        userConflictId: (userId) => `User with userId ${userId} already exists.`,
        roleIdNotFound: (roleId) => `Role with roleId ${roleId} not found.`,
        loggedOut: "You have been logged out.",
        invalidField: (fieldName) => `The request body contains an invalid field: ${fieldName}`,
        incorrectPassword: "Incorrect password.",
        loginSuccessful: "Login successful.",
        queryNotProvided: "A query was not provided.",
        invalidRoomId: "The provided roomId is invalid.",
        roomIdNotFound: (roomId) => `Room with roomId ${roomId} not found.`,
        roomConflict: (roomCode) => `Room with room code ${roomCode} already exists.`,
    }
};
exports["default"] = strings;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const crypto_1 = tslib_1.__importDefault(__webpack_require__(18));
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeRoomsRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const http_status_codes_1 = __webpack_require__(21);
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const makeRoomsRoute = (roomsDAO, authentication, authorization) => {
    const router = express_1.default.Router();
    const { getRooms, getRoomById, createRoom, checkRoomExistsById, updateRoom, deleteRoom, checkRoomExistsByRoomCode } = roomsDAO;
    /**
     * GET /api/rooms
     * Get all rooms
     */
    router.get('/', authentication, authorization('rooms.read'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const rooms = yield getRooms();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: rooms
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * GET /api/rooms/:roomId
     * Get room by id
     */
    router.get('/:roomId', authentication, authorization('rooms.read'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = parseInt(req.params.roomId);
            if (isNaN(roomId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.invalidRoomId,
                    data: null
                });
            }
            const room = yield getRoomById(roomId);
            if (room === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.roomIdNotFound(roomId),
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: room
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * POST /api/rooms/add
     * Adds a new room
     */
    router.post("/add", authentication, authorization('rooms.write'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                roomCode: joi_1.default.string().required(),
                pricePerNight: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required()
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
                    message: strings_1.default.api.roomConflict(req.body.roomCode),
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
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: strings_1.default.api.success,
                data: newRoom
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * PATCH /api/rooms/:roomId
     * Updates a room
     */
    router.patch("/:roomId", authentication, authorization('rooms.write'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = parseInt(req.params.roomId);
            if (isNaN(roomId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.invalidRoomId,
                    data: null
                });
            }
            const schema = joi_1.default.object({
                roomCode: joi_1.default.string().required(),
                pricePerNight: joi_1.default.number().required(),
                description: joi_1.default.string().required(),
                status: joi_1.default.string().required()
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
                    message: strings_1.default.api.roomIdNotFound(roomId),
                    data: null
                });
            }
            const updatedRoom = yield updateRoom(room);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: updatedRoom
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    /**
     * DELETE /api/rooms/:roomId
     * Deletes a room
     */
    router.delete("/:roomId", authentication, authorization('rooms.write'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomId = parseInt(req.params.roomId);
            if (isNaN(roomId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.invalidRoomId,
                    data: null
                });
            }
            const roomExists = yield checkRoomExistsById(roomId);
            if (!roomExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: strings_1.default.api.roomIdNotFound(roomId),
                    data: null
                });
            }
            yield deleteRoom(roomId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: null
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    return {
        router
    };
};
exports.makeRoomsRoute = makeRoomsRoute;


/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 25 */
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
            const user = yield db.oneOrNone(queries_1.default.users.getUserById, [
                userId,
            ]);
            return user;
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
            const user = yield db.oneOrNone(queries_1.default.users.getUserByUsername, [
                username,
            ]);
            return user;
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
        if (!(yield checkUserExistsById(userId))) {
            throw new Error(`User with id ${userId} not found`);
        }
        yield db.none(queries_1.default.users.deleteUser, [userId]);
    });
    const updateUser = (user) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!(yield checkUserExistsById(user.userId))) {
            throw new Error(`User with id ${user.userId} does not exist`);
        }
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
            const users = yield db.any(queries_1.default.users.searchUsers, [
                query,
            ]);
            return users;
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
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeRolesDAO = void 0;
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
var queryResultErrorCode = pg_promise_1.default.errors.queryResultErrorCode;
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const makeRolesDAO = (db) => {
    /**
     * Get role by id
     * @param roleId
     * @returns A promise that resolves to a role or null if no role is found.
     */
    const getRoleById = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const role = yield db.oneOrNone(queries_1.default.roles.getRoleById, [roleId]);
            return role;
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
        try {
            const result = yield db.one(queries_1.default.roles.checkRoleExists, [roleId]);
            return result.exists;
        }
        catch (err) {
            throw err;
        }
    });
    /**
     * Add role.
     * @param role
     * @returns A promise that resolves to the added role containing the role id.
     */
    const addRole = (role) => {
        return new Promise((resolve, reject) => {
            db.one(`
                INSERT INTO roles (name, permission_data)
                VALUES ($1, $2)
                RETURNING *
            `, [role.name, role.permissionData]).then((role) => {
                resolve(role);
            }).catch((err) => {
                reject(err);
            });
        });
    };
    /**
     * Update role.
     * @param role
     * @returns A promise that resolves to the updated role.
     */
    const updateRole = (role) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedRole = yield db.one(queries_1.default.roles.updateRole, [role.name, role.permissionData, role.roleId]);
            return updatedRole;
        }
        catch (err) {
            throw err;
        }
    });
    const getUsersWithRoles = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield db.manyOrNone(queries_1.default.roles.getUsersWithRoles, [roleId]);
            return result;
        }
        catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            throw err;
        }
    });
    const deleteRole = (roleId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const role = yield db.none(queries_1.default.roles.deleteRole, [roleId]);
        }
        catch (err) {
            throw err;
        }
    });
    /**
     * Get all roles.
     * @returns A promise that resolves to an array of roles.
     */
    const getAllRoles = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const roles = yield db.manyOrNone(queries_1.default.roles.getAllRoles);
        return roles;
    });
    return {
        getRoleById,
        checkRoleExists,
        addRole,
        updateRole,
        getAllRoles,
        deleteRole,
        getUsersWithRoles
    };
};
exports.makeRolesDAO = makeRolesDAO;
exports["default"] = exports.makeRolesDAO;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const makeTokenRevocationListDAO = (db) => {
    const revokeToken = (token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const now = new Date();
        yield db.none(queries_1.default.tokenRevocationList.revokeToken, [token, now]);
    });
    const checkTokenRevoked = (token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const tokenRevocationList = yield db.oneOrNone(queries_1.default.tokenRevocationList.checkTokenRevoked, [token]);
        if (tokenRevocationList === null) {
            return false;
        }
        return true;
    });
    return {
        revokeToken,
        checkTokenRevoked
    };
};
exports["default"] = makeTokenRevocationListDAO;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const jsonwebtoken_1 = tslib_1.__importDefault(__webpack_require__(19));
const makeAuthenticationMiddleware = (jwtSecret, tokenRevocationListDAO) => {
    const { checkTokenRevoked } = tokenRevocationListDAO;
    return (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        // check if the request has a jwt token
        if (!req.headers.authorization) {
            return res.status(401).send({
                success: false,
                message: strings_1.default.api.unauthenticated,
                statusCode: 401,
                data: null
            });
        }
        // verify the jwt token in Authorization Bearer header
        const token = req.headers.authorization.split(' ')[1];
        try {
            // check if the token is in the token revocation list
            const tokenRevoked = yield checkTokenRevoked(token);
            if (tokenRevoked) {
                return res.status(401).send({
                    success: false,
                    message: strings_1.default.api.tokenInvalid,
                    statusCode: 401,
                    data: null
                });
            }
            // verify the token
            jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: strings_1.default.api.tokenInvalid,
                        statusCode: 401,
                        data: null
                    });
                }
                // add the user id to the request
                req.userId = decoded.userId;
                req.userRoleId = decoded.roleId;
                next();
            });
        }
        catch (err) {
            return res.status(500).send({
                success: false,
                message: strings_1.default.api.serverError,
                statusCode: 500,
                data: err
            });
        }
    });
};
exports["default"] = makeAuthenticationMiddleware;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const checkPermissions_1 = tslib_1.__importDefault(__webpack_require__(30));
const makeAuthorizationMiddleware = (rolesDAO) => {
    const hasPermission = (0, checkPermissions_1.default)(rolesDAO);
    return (requiredPermission) => {
        const response = {
            success: false,
            statusCode: 500,
            message: strings_1.default.api.serverError,
            data: null
        };
        return (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (req.userRoleId === undefined) {
                response.statusCode = 401;
                response.message = strings_1.default.api.unauthenticated;
                return res.status(response.statusCode).send(response);
            }
            try {
                const userHasPermission = yield hasPermission(requiredPermission, req.userRoleId);
                if (!userHasPermission) {
                    response.statusCode = 401;
                    response.message = strings_1.default.api.unauthorized;
                    return res.status(response.statusCode).send(response);
                }
                next();
            }
            catch (err) {
                response.statusCode = 500;
                response.message = strings_1.default.api.serverError;
                return res.status(response.statusCode).send(response);
            }
        });
    };
};
exports["default"] = makeAuthorizationMiddleware;


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const makePermissionChecker = (rolesDAO) => {
    const { getRoleById } = rolesDAO;
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
/* 31 */
/***/ ((module) => {

module.exports = require("process");

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const makeRolesRoute = (rolesDAO, authentication, authorization) => {
    const { getAllRoles, addRole, deleteRole, checkRoleExists, getUsersWithRoles, getRoleById } = rolesDAO;
    const router = express_1.default.Router();
    router.get("/", authentication, authorization("roles.read"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roles = yield getAllRoles();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Roles fetched successfully",
                data: roles,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch roles",
                data: err.message,
            });
        }
    }));
    router.post("/add", authentication, authorization("roles.add"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
                    message: "Invalid request body",
                    data: error.message,
                });
            }
            // TODO: validate if permissions are valid
            // TODO: check if a role with the same name already exists
            const newRole = {
                name: req.body.name,
                permissionData: req.body.permissionData
            };
            const role = yield addRole(newRole);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: "Role added successfully",
                data: role,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to add role",
                data: err.message,
            });
        }
    }));
    router.delete("/:roleId", authentication, authorization("roles.delete"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roleId = parseInt(req.params.roleId);
            // check if role exists
            const roleExists = yield checkRoleExists(roleId);
            if (!roleExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Role not found",
                    data: null,
                });
            }
            // check if any user has this role
            const usersWithRole = yield getUsersWithRoles(roleId);
            if (usersWithRole.length > 0) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Cannot delete role as there are users with this role",
                    data: null,
                });
            }
            const role = yield deleteRole(roleId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Role deleted successfully",
                data: role,
            });
        }
        catch (err) {
            console.log(err);
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to delete role",
                data: err.message,
            });
        }
    }));
    router.get("/:roleId", authentication, authorization("roles.read"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const roleId = parseInt(req.params.roleId);
            // check if role exists
            const roleExists = yield checkRoleExists(roleId);
            if (!roleExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Role not found",
                    data: null,
                });
            }
            const role = yield getRoleById(roleId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Role fetched successfully",
                data: role,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch role",
                data: err.message,
            });
        }
    }));
    return {
        router
    };
};
exports["default"] = makeRolesRoute;


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const pg_promise_1 = tslib_1.__importDefault(__webpack_require__(13));
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
var QueryResultError = pg_promise_1.default.errors.QueryResultError;
var queryResultErrorCode = pg_promise_1.default.errors.queryResultErrorCode;
const makeGuestDAO = (db) => {
    const getGuests = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guests = yield db.any(queries_1.default.guests.getGuests);
            return guests;
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
    const addGuest = (guest) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const newGuest = yield db.one(queries_1.default.guests.addGuest, [
                guest.firstName,
                guest.lastName,
                guest.email,
                guest.phoneNumber,
                guest.address
            ]);
            return newGuest;
        }
        catch (err) {
            throw err;
        }
    });
    const updateGuest = (guest) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedGuest = yield db.one(queries_1.default.guests.updateGuest, [
                guest.firstName,
                guest.lastName,
                guest.email,
                guest.phoneNumber,
                guest.address,
                guest.guestId
            ]);
            return updatedGuest;
        }
        catch (err) {
            throw err;
        }
    });
    const deleteGuest = (guestId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedGuest = yield db.none(queries_1.default.guests.deleteGuest, [
                guestId
            ]);
        }
        catch (err) {
            throw err;
        }
    });
    const checkGuestExistsById = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const exists = yield db.one(queries_1.default.guests.checkGuestExistsById, [
                id
            ]);
            return exists;
        }
        catch (err) {
            if (err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData) {
                return false;
            }
            else {
                throw err;
            }
        }
    });
    const getGuestById = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guest = yield db.one(queries_1.default.guests.getGuestById, [
                id
            ]);
            return guest;
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
    const searchGuests = (query) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guests = yield db.any(queries_1.default.guests.searchGuests, [
                query
            ]);
            return guests;
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
        searchGuests
    };
};
exports["default"] = makeGuestDAO;


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const strings_1 = tslib_1.__importDefault(__webpack_require__(16));
const makeGuestsRoute = (guestsDAO, authentication, authorization) => {
    const { getGuests, addGuest, updateGuest, deleteGuest, checkGuestExistsById, getGuestById, searchGuests } = guestsDAO;
    const router = express_1.default.Router();
    router.get("/", authentication, authorization("guests.read"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guests = yield getGuests();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Guests fetched successfully",
                data: guests,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch guests",
                data: err.message,
            });
        }
    }));
    router.get("/search", authentication, authorization('guests.read'), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = req.query.q;
            if (query === undefined || query === null || query === "") {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: strings_1.default.api.queryNotProvided,
                    data: null
                });
            }
            const users = yield searchGuests(query.toString());
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: strings_1.default.api.success,
                data: users
            });
        }
        catch (e) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: strings_1.default.api.serverError,
                data: e
            });
        }
    }));
    router.get("/:guestId", authentication, authorization("guests.read"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid guest id",
                    data: null,
                });
            }
            const guest = yield getGuestById(guestId);
            if (guest === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Guest fetched successfully",
                data: guest,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch guest",
                data: err.message,
            });
        }
    }));
    router.post("/add", authentication, authorization("guests.create"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required(),
                phoneNumber: joi_1.default.string().optional().allow(""),
                address: joi_1.default.string().optional().allow(""),
                email: joi_1.default.string().optional().allow(""),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid request body",
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
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: "Guest added successfully",
                data: guest,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to add guest",
                data: err.message,
            });
        }
    }));
    router.patch("/:guestId", authentication, authorization("guests.update"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid guest id",
                    data: null,
                });
            }
            // check if guest exists
            const guestExists = yield checkGuestExistsById(guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                });
            }
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().required(),
                lastName: joi_1.default.string().required(),
                phoneNumber: joi_1.default.string().optional().allow(""),
                address: joi_1.default.string().optional().allow(""),
                email: joi_1.default.string().optional().allow(""),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid request body",
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
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Guest updated successfully",
                data: guest,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to update guest",
                data: err.message,
            });
        }
    }));
    router.delete("/:guestId", authentication, authorization("guests.delete"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const guestId = parseInt(req.params.guestId);
            if (isNaN(guestId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid guest id",
                    data: null,
                });
            }
            // check if guest exists
            const guestExists = yield checkGuestExistsById(guestId);
            if (!guestExists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Guest not found",
                    data: null,
                });
            }
            const guest = yield deleteGuest(guestId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Guest deleted successfully",
                data: null,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to delete guest",
                data: err.message,
            });
        }
    }));
    return {
        router
    };
};
exports["default"] = makeGuestsRoute;


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeReservationDAO = void 0;
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const pgPromise = __webpack_require__(13);
var QueryResultError = pgPromise.errors.QueryResultError;
var queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
const makeReservationDAO = (db) => {
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
    const getReservationById = (reservationId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservation = yield db.oneOrNone(queries_1.default.reservations.getReservationById, [reservationId]);
            return reservation;
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
    const checkReservationExistsById = (reservationId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const exists = yield db.one(queries_1.default.reservations.checkReservationExistsById, [reservationId]);
            return exists.exists;
        }
        catch (err) {
            throw err;
        }
    });
    const createReservation = (reservation) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const newReservation = yield db.one(queries_1.default.reservations.addReservation, [reservation.roomId, reservation.guestId, reservation.startDate, reservation.endDate, reservation.reservationStatus]);
            return newReservation;
        }
        catch (err) {
            throw err;
        }
    });
    const updateReservation = (reservation) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedReservation = yield db.one(queries_1.default.reservations.updateReservation, [reservation.roomId, reservation.guestId, reservation.startDate, reservation.endDate, reservation.reservationId]);
            return updatedReservation;
        }
        catch (err) {
            throw err;
        }
    });
    const deleteReservation = (reservationId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db.none(queries_1.default.reservations.deleteReservation, [reservationId]);
        }
        catch (err) {
            throw err;
        }
    });
    return {
        getReservations,
        getReservationById,
        createReservation,
        deleteReservation,
        updateReservation,
        checkReservationExistsById
    };
};
exports.makeReservationDAO = makeReservationDAO;


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeReservationsRoute = void 0;
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(14));
const sendResponse_1 = tslib_1.__importDefault(__webpack_require__(20));
const http_status_codes_1 = __webpack_require__(21);
const joi_1 = tslib_1.__importDefault(__webpack_require__(22));
const makeReservationsRoute = (reservationsDAO, guestsDAO, authentication, authorization) => {
    const router = express_1.default.Router();
    const { getReservations, getReservationById, createReservation, checkReservationExistsById, updateReservation, deleteReservation } = reservationsDAO;
    const { checkGuestExistsById } = guestsDAO;
    /**
     * Get all reservations
     */
    router.get("/", authentication, authorization("reservations.read"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservations = yield getReservations();
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Reservations fetched successfully",
                data: reservations,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch reservations",
                data: err.message,
            });
        }
    }));
    /**
     * Get reservation by id
     */
    router.get("/:reservationId", authentication, authorization("reservations.read"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservationId = parseInt(req.params.reservationId);
            if (isNaN(reservationId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid reservation id",
                    data: null
                });
            }
            const reservation = yield getReservationById(reservationId);
            if (reservation === null) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Reservation not found",
                    data: null
                });
            }
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Reservation fetched successfully",
                data: reservation,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to fetch reservation",
                data: err.message,
            });
        }
    }));
    /**
     * Create reservation
     */
    router.post("/add", authentication, authorization("reservations.create"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                reservationId: joi_1.default.number().optional(),
                roomId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                startDate: joi_1.default.date().required(),
                endDate: joi_1.default.date().required(),
                checkInDate: joi_1.default.date().optional(),
                checkOutDate: joi_1.default.date().optional(),
                reservationStatus: joi_1.default.string().optional()
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
            const reservation = {
                reservationId: req.body.reservationId,
                roomId: req.body.roomId,
                guestId: req.body.guestId,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                checkInDate: req.body.checkInDate,
                checkOutDate: req.body.checkOutDate,
                reservationStatus: req.body.reservationStatus
            };
            const newReservation = yield createReservation(reservation);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Reservation created successfully",
                data: newReservation,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to create reservation",
                data: err,
            });
        }
    }));
    /**
     * Update reservation
     */
    router.patch("/:reservationId", authentication, authorization("reservations.update"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservationId = parseInt(req.params.reservationId);
            if (isNaN(reservationId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid reservation id",
                    data: null,
                });
            }
            // check if reservation exists
            const exists = yield checkReservationExistsById(reservationId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Reservation not found",
                    data: null,
                });
            }
            const schema = joi_1.default.object({
                reservationId: joi_1.default.number().required(),
                roomId: joi_1.default.number().required(),
                guestId: joi_1.default.number().required(),
                startDate: joi_1.default.date().required(),
                endDate: joi_1.default.date().required(),
                checkInDate: joi_1.default.date().optional(),
                checkOutDate: joi_1.default.date().optional(),
                reservationStatus: joi_1.default.string().optional()
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
                    message: "Guest not found",
                    data: null,
                });
            }
            // TODO: check if the room exists
            //parse the dates
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);
            const reservation = {
                reservationId: req.body.reservationId,
                roomId: req.body.roomId,
                guestId: req.body.guestId,
                startDate: startDate,
                endDate: endDate,
                checkInDate: req.body.checkInDate,
                checkOutDate: req.body.checkOutDate,
                reservationStatus: req.body.reservationStatus
            };
            const updatedReservation = yield updateReservation(reservation);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Reservation updated successfully",
                data: updatedReservation,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to update reservation",
                data: err.message,
            });
        }
    }));
    /**
     * Delete reservation
     */
    router.delete("/:reservationId", authentication, authorization("reservations.delete"), (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const reservationId = parseInt(req.params.reservationId);
            if (isNaN(reservationId)) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "Invalid reservation id",
                    data: null,
                });
            }
            // check if reservation exists
            const exists = yield checkReservationExistsById(reservationId);
            if (!exists) {
                return (0, sendResponse_1.default)(res, {
                    success: false,
                    statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Reservation not found",
                    data: null,
                });
            }
            yield deleteReservation(reservationId);
            return (0, sendResponse_1.default)(res, {
                success: true,
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: "Reservation deleted successfully",
                data: null,
            });
        }
        catch (err) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Failed to delete reservation",
                data: err.message,
            });
        }
    }));
    return {
        router
    };
};
exports.makeReservationsRoute = makeReservationsRoute;


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeRoomsDAO = void 0;
const tslib_1 = __webpack_require__(1);
const queries_1 = tslib_1.__importDefault(__webpack_require__(11));
const pgPromise = __webpack_require__(13);
var QueryResultError = pgPromise.errors.QueryResultError;
var queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
const makeRoomsDAO = (db) => {
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
    const getRoomById = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const room = yield db.oneOrNone(queries_1.default.rooms.getRoomById, [roomId]);
            return room;
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
    const checkRoomExistsById = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const exists = yield db.one(queries_1.default.rooms.checkRoomExistsById, [roomId]);
            return exists.exists;
        }
        catch (err) {
            throw err;
        }
    });
    const checkRoomExistsByRoomCode = (roomCode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const exists = yield db.one(queries_1.default.rooms.checkRoomExistsByRoomCode, [roomCode]);
            return exists.exists;
        }
        catch (err) {
            throw err;
        }
    });
    const createRoom = (room) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const newRoom = yield db.one(queries_1.default.rooms.addRoom, [room.roomCode, room.pricePerNight, room.description, room.status]);
            return newRoom;
        }
        catch (err) {
            throw err;
        }
    });
    const updateRoom = (room) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedRoom = yield db.one(queries_1.default.rooms.updateRoom, [room.roomCode, room.pricePerNight, room.description, room.status, room.roomId]);
            return updatedRoom;
        }
        catch (err) {
            throw err;
        }
    });
    const deleteRoom = (roomId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db.none(queries_1.default.rooms.deleteRoom, [roomId]);
        }
        catch (err) {
            throw err;
        }
    });
    return {
        getRooms,
        getRoomById,
        createRoom,
        checkRoomExistsById,
        updateRoom,
        deleteRoom,
        checkRoomExistsByRoomCode
    };
};
exports.makeRoomsDAO = makeRoomsDAO;


/***/ }),
/* 38 */
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
const os_1 = tslib_1.__importDefault(__webpack_require__(38));
const path_1 = tslib_1.__importDefault(__webpack_require__(24));
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