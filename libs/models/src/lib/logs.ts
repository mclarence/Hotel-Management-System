export type Logs = {
    logId: number;           // corresponds to log_id in the database
    operationType: string;   // corresponds to operation_type in the database
    timestamp: Date;        // corresponds to timestamp in the database
    operatedBy: string;     // corresponds to operated_by in the database
    guestName?: string;     // corresponds to guest_name in the database (it's optional)
    additionalInfo?: string; // corresponds to additional_info in the database (it's optional)
}

