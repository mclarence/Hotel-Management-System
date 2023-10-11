import {Logs} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;

export interface ILogsDAO {
    getAllLogs: () => Promise<Logs[]>;
    addLog: (log: Logs) => Promise<Logs | null>;
    deleteLog: (logId: number) => Promise<void>;
}

/**
 * Logs DAO
 * @param db - database object
 */
const makeLogsDAO = (db: IDatabase<any, any>): ILogsDAO => {

    /**
     * Get all logs
     */
    const getAllLogs = async (): Promise<Logs[]> => {
        return await db.any(queries.logs.getAllLogs)
    }

    /**
     * Add log
     * @param log
     * @returns logs, null if no logs
     */
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


    /**
     * Delete log
     * @param logId
     * @returns void
     */
    const deleteLog = async (logId: number): Promise<void> => {
        await db.none(queries.logs.deleteLog, {logId});
    }

    return {
        getAllLogs,
        addLog,
        deleteLog,
    }
}

export default makeLogsDAO;