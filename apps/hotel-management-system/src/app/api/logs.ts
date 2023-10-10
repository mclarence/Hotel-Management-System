// logsAPI.ts

import { Logs } from "libs/models/src/lib/models";

export const getLogs = (): Promise<Response> => {
    return fetch('/api/logs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

export const addLog = (log: Logs): Promise<Response> => {
    return fetch('/api/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(log)
    });
}

export const deleteLog = (logId: number): Promise<Response> => {
    return fetch(`/api/logs/${logId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}


