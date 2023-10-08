import express from "express";
import { ILogsDAO } from "../database/logs"; // Adjust for function
import { IAuthenticationMiddleware } from "../middleware/authentication";
import { IAuthorizationMiddleware } from "../middleware/authorization";

interface IMakeLogsRoute {
  router: express.Router;
}

const makeLogsRoute = (
    logsDAO: ILogsDAO,
    authentication: IAuthenticationMiddleware,
    authorization: IAuthorizationMiddleware,
) => {
  const router = express.Router();

  const {
    getAllLogs,
    addLog,
    deleteLog,
} = logsDAO;

  router.get("/", (req, res) => {
    // return the list of all logs
    getAllLogs
      .then((logs) => {
        res.send(logs);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  router.post("/", (req, res) => {
    // create a new log
    const log = req.body;
    addLog(log)
      .then((newLog) => {
        res.send(newLog);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  });

  router.delete("/:logId", (req, res) => {
    // delete a log by logId
    const logId = parseInt(req.params.logId);
    deleteLog(logId)
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(404);
      });
  });

  return {
    router
  }
};

export default makeLogsRoute;