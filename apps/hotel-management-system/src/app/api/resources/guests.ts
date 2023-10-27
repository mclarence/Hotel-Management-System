import { Guest } from '@hotel-management-system/models';

// gets all guests 1
export const getGuests = (): Promise<Response> => {
    return fetch('/api/guests', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// deletes a guest
export const deleteGuest = (id: number): Promise<Response> => {
    return fetch(`/api/guests/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// adds a guest
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

// updates a guest
export const updateGuest = (guest: Guest): Promise<Response> => {

    const updatedGuest = {...guest}
    delete updatedGuest.guestId

    return fetch (`/api/guests/${guest.guestId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(updatedGuest)
    })
}

// gets a guest by id
export const getGuestById = (id: number): Promise<Response> => {
    return fetch(`/api/guests/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

// searches for guests
export const searchGuests = (query: string): Promise<Response> => {
    return fetch(`/api/guests/search?q=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}