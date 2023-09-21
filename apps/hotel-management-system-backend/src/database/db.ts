import {ServerConfig} from "@hotel-management-system/models";
import {configFilePath} from "../main";
import {logger} from "../logger";

const pgp = require('pg-promise')();

// load json file
const fs = require('fs');
const config: ServerConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

// Preparing the connection details:
const cn = {
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
}

// Creating a new database instance from the connection details:
const db = pgp(cn);

const createTables = async () => {
    await db.none(`
        CREATE TABLE IF NOT EXISTS roles (
            roleId SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            permissionData JSONB NOT NULL
        );
        CREATE TABLE IF NOT EXISTS users (
            userId SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            passwordSalt VARCHAR(255) NOT NULL,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phoneNumber VARCHAR(255) NOT NULL,
            position VARCHAR(255) NOT NULL,
            roleId INTEGER NOT NULL,
            FOREIGN KEY (roleId) REFERENCES roles(roleId)
        );
    `).then(() => {
        logger.info("Created tables");
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
            logger.info("Default superadmin role does not exist");
            // create default superadmin role
            await db.none(`
                INSERT INTO roles (name, permissionData) VALUES ('superadmin', '{"*": {"read": true, "write": true, "delete": true}}');
                `).then(() => {
                logger.info("Created default superadmin role");
            }).catch((err) => {
                logger.warn("Failed to create default superadmin role");
                logger.warn(err);
            });
        } else {
            logger.info("Default superadmin role exists");
            return;
        }
    }).catch((err) => {
        logger.warn("Failed to check if default superadmin role exists");
        logger.warn(err);
    })
}


// Exporting the database object for shared use:
export {db, createTables}