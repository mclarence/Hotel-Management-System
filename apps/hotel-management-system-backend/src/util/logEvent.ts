import {ILogsDAO} from "../database/logs";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";

export interface IEventLogger {
    (eventType: LogEventTypes, userId: number, description?: string): Promise<void>;
}

/**
 * Event Logger to log events to the database
 * @param logsDAO - logs DAO
 */
export const makeEventLogger = (logsDAO: ILogsDAO): IEventLogger => {

    /**
     * Log an event to the database
     * @param eventType - event type
     * @param userId - user id
     * @param description - description
     */
    return async (eventType: LogEventTypes, userId: number, description?: string) => {
        try {
            await logsDAO.addLog({
                eventType: eventType,
                timestamp: new Date(),
                userId: userId,
                description: description
            })
        } catch (error) {
            throw error;
        }
    }
}