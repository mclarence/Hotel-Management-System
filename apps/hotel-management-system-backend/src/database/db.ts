import {logger} from "../logger";
import queries from "./sql/queries";
import {camelizeColumns} from "../util/camelizeColumns";
import {IDatabase} from "pg-promise";
import {ServerConfig} from "@hotel-management-system/models";

import pg_promise from "pg-promise";

interface Database {
    db: IDatabase<any, any>,
    createTables: () => Promise<void>,
    testConnection: () => Promise<void>,
}

const createDatabase = (options: ServerConfig): Database => {
    let noWarnings = false;
    if (process.env['NODE_ENV'] === 'test') {
        noWarnings = true;
    }

    const pgp = pg_promise({
        receive(e) {
            camelizeColumns(e.data);
        },
        noWarnings: noWarnings
    });



    const db = pgp({
        host: options.database.host,
        port: options.database.port,
        database: options.database.database,
        user: options.database.user,
        password: options.database.password,
    });

    const testConnection = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            db.connect()
                .then((e) => {
                    logger.debug(`Connected to database ${e.client.connectionParameters.host}`);
                    resolve();
                })
                .catch((err) => {
                    logger.fatal("Failed to connect to database");
                    logger.fatal(err);
                    reject(err);
                });
        })

    }
    const createTables = async () => {
        logger.debug("Creating tables");
        await db.none(queries.tables.createAll).then(() => {
            logger.debug("Created tables");
        }).catch((err) => {
            logger.fatal("Failed to create tables");
            logger.fatal(err);
            process.exit(1);
        });
    }


    return {
        db,
        createTables,
        testConnection
    }
}


export default createDatabase;