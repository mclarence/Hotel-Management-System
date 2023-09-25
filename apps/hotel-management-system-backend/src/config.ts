import {ServerConfig} from "@hotel-management-system/models";
import minimist from "minimist";
import fs from "fs";

interface ApplicationConfig {
    loadFromFile: (pathToFile: string) => Promise<void>,
    loadFromArgs: (args: string[]) => Promise<void>,
    getConfig: () => ServerConfig
}

const makeConfig = (): ApplicationConfig => {
    let _config: ServerConfig = {
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
    }

    const loadFromFile = (pathToFile: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(pathToFile)) {
                reject(new Error("Config file does not exist"));
            }

            let configFile: ServerConfig;
            try {
                configFile = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
            } catch (e) {
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

            _config = configFile

            resolve();
        })
    }

    const loadFromArgs = (args: string[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            enum ArgKeys {
                LISTEN_ADDRESS = 'listenAddress',
                LISTEN_PORT = 'listenPort',
                DATABASE_HOST = 'database-host',
                DATABASE_PORT = 'database-port',
                DATABASE_NAME = 'database-name',
                DATABASE_USER = 'database-user',
                DATABASE_PASSWORD = 'database-password',
                JWT_SECRET = 'jwt-secret'

            }

            const requriedArgs = [ArgKeys.DATABASE_HOST, ArgKeys.DATABASE_PORT, ArgKeys.DATABASE_NAME, ArgKeys.DATABASE_USER, ArgKeys.DATABASE_PASSWORD, ArgKeys.JWT_SECRET]
            const parsedArgs = minimist(args, {
                //string: ['listenAddress', 'database-host', 'database-name', 'database-user', 'database-password', 'jwt-secret'],
                string: [ArgKeys.LISTEN_ADDRESS, ArgKeys.DATABASE_HOST, ArgKeys.DATABASE_NAME, ArgKeys.DATABASE_USER, ArgKeys.DATABASE_PASSWORD, ArgKeys.JWT_SECRET]
            })

            for (const arg of requriedArgs) {
                if (parsedArgs[arg] === undefined) {
                    reject(new Error(`Missing required argument ${arg}`));
                }
            }

            _config.server.listenAddress = parsedArgs[ArgKeys.LISTEN_ADDRESS] || "127.0.0.1"
            _config.server.port = parsedArgs[ArgKeys.LISTEN_PORT] || 3333
            _config.database.host = parsedArgs[ArgKeys.DATABASE_HOST]
            _config.database.port = parsedArgs[ArgKeys.DATABASE_PORT]
            _config.database.database = parsedArgs[ArgKeys.DATABASE_NAME]
            _config.database.user = parsedArgs[ArgKeys.DATABASE_USER]
            _config.database.password = parsedArgs[ArgKeys.DATABASE_PASSWORD]
            _config.jwt.secret = parsedArgs[ArgKeys.JWT_SECRET]

            resolve();
        })
    }

    return {
        getConfig: () => _config,
        loadFromFile,
        loadFromArgs,
    }

}


export default makeConfig;