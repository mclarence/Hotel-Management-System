import {LogEventTypes} from "./enums/LogEventTypes";

export type Logs = {
    logId?: number;           // corresponds to log_id in the database
    eventType: LogEventTypes;   // corresponds to operation_type in the database
    timestamp: Date;        // corresponds to timestamp in the database
    userId: number;     // corresponds to operated_by in the database
    description?: string; // corresponds to additional_info in the database (it's optional)
}

