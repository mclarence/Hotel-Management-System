/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import makeConfig from "./config";
import startServer from "./startServer";
import {logger} from "./logger";
import os from "os";
import path from "path";

const config = makeConfig();
// check if command line arguments were passed
if (process.argv.length > 2) {
    // load config from command line arguments
    config.loadFromArgs(process.argv.slice(2))
        .then(async () => {
            const server = await startServer(config.getConfig())
            return server.start();
        })
        .catch((err) => {
            logger.fatal(err);
            process.exit(1);
        })
} else {
    // load config from file
    const homedir = os.homedir();
    const configPath = path.join(homedir, '.config', 'hotel-management-system-backend', 'server-config.json');
    logger.info(`Loading config from ${configPath}`)
    config.loadFromFile(configPath)
        .then(async () => {
            logger.info("Loaded config");
            const server = await startServer(config.getConfig())
            return server.start();
        })
        .catch((err) => {
            logger.fatal(err);
            process.exit(1);
        })
}

export {
    config
}




