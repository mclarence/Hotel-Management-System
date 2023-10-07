import { Guest } from '@hotel-management-system/models';

const getGuests = (): Promise<Response> => {
    return fetch('/api/guests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}