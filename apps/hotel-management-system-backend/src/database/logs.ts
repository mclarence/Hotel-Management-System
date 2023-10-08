import { Logs } from "@hotel-management-system/models";
import { IDatabase } from "pg-promise";

export interface ILogsDAO {
  getAllLogs: Promise<Logs[]>;
  addLog: (log: Omit<Logs, "logId">) => Promise<Logs>;
  deleteLog: (logId: number) => Promise<void>;
}

const makeLogsDAO = (db: IDatabase<any, any>): ILogsDAO => {
  const logs: Logs[] = [];

  const getAllLogs = new Promise<Logs[]>((resolve) => {
    resolve(logs);
  });


  const addLog = (log: Omit<Logs, "logId">): Promise<Logs> => {
    return new Promise<Logs>((resolve) => {
      const newLog: Logs = {
        ...log,
        logId: logs.length + 1,
      };

      logs.push(newLog);
      resolve(newLog);
    });
  };

  const deleteLog = (logId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const index = logs.findIndex((log) => log.logId === logId);

      if (index === -1) {
        reject(`Log with id ${logId} not found`);
      } else {
        logs.splice(index, 1);
        resolve();
      }
    });
  };

  return {
    getAllLogs,
    addLog,
    deleteLog,
  };
};

export default makeLogsDAO;