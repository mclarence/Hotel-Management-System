import {logger} from "../logger";
import config from "../config";
import queries from "./sql/queries";
import {camelizeColumns} from "../util/camelizeColumns";

const fs = require('fs');

const pgp = require('pg-promise')({
    receive(e) {
        camelizeColumns(e.data);
    }
});

const db = pgp({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
});

const createTables = async () => {
    logger.debug("Creating tables");
    await db.none(queries.tables.createAll).then(() => {
        logger.debug("Created tables");
    }).catch((err) => {
        logger.fatal("Failed to create tables");
        logger.fatal(err);
        process.exit(1);
    });

    // check if the superadmin role exists
    await db.oneOrNone(`
        SELECT * FROM roles WHERE name = 'superadmin';
        `).then(async (role) => {
        if (role === null) {
            logger.debug("Default superadmin role does not exist");
            // create default superadmin role
            await db.none(`
                INSERT INTO roles (name, permission_data) VALUES ('superadmin', '{"*": {"read": true, "write": true, "delete": true}}');
                `).then(() => {
                logger.debug("Created default superadmin role");
            }).catch((err) => {
                logger.warn("Failed to create default superadmin role");
                logger.warn(err);
            });
        } else {
            logger.debug("Default superadmin role exists");
            return;
        }
    }).catch((err) => {
        logger.debug("Failed to check if default superadmin role exists");
        logger.debug(err);
    })
}


// Exporting the database object for shared use:
export {db, createTables}