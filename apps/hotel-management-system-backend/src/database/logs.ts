import {Logs} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;

export interface ILogsDAO {
    getAllLogs: () => Promise<Logs[]>;
    addLog: (log: Logs) => Promise<Logs | null>;
    deleteLog: (logId: number) => Promise<void>;
}

const makeLogsDAO = (db: IDatabase<any, any>): ILogsDAO => {

    const getAllLogs = async (): Promise<Logs[]> => {
        try {
            return await db.any(queries.logs.getAllLogs)
        } catch (error) {
            throw error;
        }
    }

    const addLog = async (log: Logs): Promise<Logs | null> => {
        try {
            return await db.one(queries.logs.addLog, [log.eventType, log.timestamp, log.userId, log.description]);
        } catch (error) {
            if (error instanceof QueryResultError && error.code === pgPromise.errors.queryResultErrorCode.noData) {
                return null;
            }
            throw error;
        }
    }


    const deleteLog = async (logId: number): Promise<void> => {
        try {
            await db.none(queries.logs.deleteLog, {logId});
        } catch (error) {
            throw error;
        }
    }

    return {
        getAllLogs,
        addLog,
        deleteLog,
    }
}

export default makeLogsDAO;