import { Guest } from '@hotel-management-system/models';

export const getGuests = (): Promise<Response> => {
    return fetch('/api/guests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const deleteGuest = (id: number): Promise<Response> => {
    return fetch(`/api/guests/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const addGuest = (guest: Guest): Promise<Response> => {
    return fetch ('/api/guests/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(guest)
    })
}