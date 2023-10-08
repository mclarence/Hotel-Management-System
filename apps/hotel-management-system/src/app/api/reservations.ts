export const getReservations = async (): Promise<Response> => {
    return fetch('/api/reservations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}