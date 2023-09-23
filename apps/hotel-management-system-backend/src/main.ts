/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import * as path from 'path';
import express from 'express';
import {expressLogger, logger} from './logger';
import {ApiResponse} from "@hotel-management-system/models";
import usersRouter from './resources/usersRoute';
import roomsRouter from "./resources/roomsRoute";
import {createTables, db} from './database/db';
import config from "./config";

const startServer = async () => {
    logger.info("Starting server");

    await db.connect()
        .then(async (e) => {
            logger.info(`Connected to database ${e.client.connectionParameters.host}`);
            await createTables();
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

    const port = config.server.port || 3333;
    const server = app.listen(port, () => {
        logger.info(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
}

startServer();


