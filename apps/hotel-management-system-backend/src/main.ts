/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as path from 'path';
import os from 'os';
const fs = require('fs');

const homeDir = os.homedir();
export const configFilePath = path.join(homeDir,'.config', 'hotel-management-system-backend', 'server-config.json');

import express from 'express';
import {logger, expressLogger} from './logger';
import usersRouter from "./resources/usersRoute";
import roomsRouter from "./resources/roomsRoute";
import {db, createTables} from './database/db';
import {ApiResponse} from "@hotel-management-system/models";

const startServer = async () => {
    logger.info("Starting server");

    await db.connect()
        .then((e) => {
            createTables();
            logger.info(`Connected to database ${e.client.connectionParameters.host}`);
        })
        .catch((err) => {
            logger.fatal("Failed to connect to database");
            logger.fatal(err);
            process.exit(1);
        });

    const app = express();

    app.use(express.json())
    app.use(expressLogger);
    app.use("/api/users", usersRouter);
    app.use("/api/rooms", roomsRouter);
    app.use(express.static(path.join(__dirname, 'assets')));

    // catch all errors
    app.use((err: any, req, res, next) => {
        if ('body' in err && err.status === 400 && err instanceof SyntaxError) {
            res.status(400).send({
                    success: false,
                    message: "Invalid request body",
                    statusCode: 400,
                    data: err.message
                } as ApiResponse
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

    const port = process.env.PORT || 3333;
    const server = app.listen(port, () => {
        logger.info(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
}

const validateConfigFile = () => {
    logger.info("Validating config file...");
    // check if config file exists
    const fs = require('fs');
    if (!fs.existsSync(configFilePath)) {
        logger.fatal("Config file does not exist");
        process.exit(1);
    }

    // check if config file is valid json
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    if (!config) {
        logger.fatal("Config file is not valid json");
        process.exit(1);
    }

    // check if config file has all required fields
    const requiredFields = ['database', 'database.host', 'database.port', 'database.database', 'database.user', 'database.password'];
    for (const field of requiredFields) {
        const fieldParts = field.split('.');
        let value = config;
        for (const part of fieldParts) {
            if (value[part] === undefined) {
                logger.fatal(`Config file is missing field ${field}`);
                process.exit(1);
            }
            value = value[part];
        }
    }

    logger.info("Config file is valid");

}

validateConfigFile();
startServer();


