import path from "path";
import os from "os";
import {logger} from "./logger";
import {ServerConfig} from "@hotel-management-system/models";
const fs = require('fs');
const homeDir = os.homedir();
export const configFilePath = path.join(homeDir, '.config', 'hotel-management-system-backend', 'server-config.json');

logger.info(`Loading configuration from ${configFilePath}`);
// check if config file exists
if (!fs.existsSync(configFilePath)) {
    logger.fatal("Config file does not exist");
    process.exit(1);
}

// check if config file is valid json
let config: ServerConfig
try {
    config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
} catch (e) {
    logger.fatal("Config file is not valid json");
    logger.fatal(e)
    process.exit(1);
}

// check if config file has all required fields
const requiredFields = ['database', 'database.host', 'database.port', 'database.database', 'database.user', 'database.password', 'jwt.secret', 'server.port'];
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

// set default values for optional fields
if (config.server.listenAddress === undefined) {
    config.server.listenAddress = 'localhost';
}

logger.info("Configuration is valid.");


export default config