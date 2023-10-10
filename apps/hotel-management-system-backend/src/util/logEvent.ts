import {ILogsDAO} from "../database/logs";
import {LogEventTypes} from "../../../../libs/models/src/lib/enums/LogEventTypes";

export interface IEventLogger {
    (eventType: LogEventTypes, userId: number, description?: string): Promise<void>;
}
export const makeEventLogger = (logsDAO: ILogsDAO): IEventLogger => {
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