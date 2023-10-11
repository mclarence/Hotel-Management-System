import {ServerConfig} from "@hotel-management-system/models";

export const serverConfig: ServerConfig = {
    database: {
        database: "ads-db",
        host: "127.0.0.1",
        password: "mysecretpassword",
        port: 5432,
        user: "postgres"
    },
    jwt: {
        secret: "themostsupersecretstring"
    },
    server: {
        listenAddress: "127.0.0.1",
        port: 3333
    }

}