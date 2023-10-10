export const getLogs = (): Promise<Response> => {
    return fetch('/api/logs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

