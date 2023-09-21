// check if the environment is development and if so, import pino-pretty
import pino, { Logger } from "pino";
import pinoHttp, {HttpLogger} from "pino-http";

let logger: Logger<any>;
let expressLogger: HttpLogger<any>;

if (process.env.NODE_ENV === "development") {
    const pretty = require("pino-pretty");
    logger = pino(pretty())
    logger.level = "debug";
    expressLogger = pinoHttp(pretty());
} else {
    logger = pino();
    expressLogger = pinoHttp();
}

export { logger, expressLogger };