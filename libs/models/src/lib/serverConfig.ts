export type ServerConfig = {
    server: {
        port: number
        listenAddress: string
    },
    database: {
        host: string,
        port: number,
        user: string,
        password: string,
        database: string
    },
    jwt: {
        secret: string
    }
}