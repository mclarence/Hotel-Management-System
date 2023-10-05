import { Logs } from '@hotel-management-system/models';

const logs: Logs[] = [];

export const getAllLogs = new Promise<Logs[]>((resolve) => {
    resolve(logs);
});

export const getLogsForRoom = (roomId: number): Promise<Logs[]> => {
    return new Promise<Logs[]>((resolve) => {
        const roomLogs = logs.filter(log => log.data === roomId.toString());
        resolve(roomLogs);
    })
}

export const addLog = (log: Omit<Logs, 'logId'>): Promise<Logs> => {
    return new Promise<Logs>((resolve) => {
        const newLog: Logs = {
            ...log,
            logId: logs.length + 1
        };

        logs.push(newLog);
        resolve(newLog);
    })
}

export const deleteLog = (logId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const index = logs.findIndex(log => log.logId === logId);

        if (index === -1) {
            reject(`Log with id ${logId} not found`);
        } else {
            logs.splice(index, 1);
            resolve();
        }
    })
}
