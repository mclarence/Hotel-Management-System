import {Reservation} from "@hotel-management-system/models"

export const getReservations = async (): Promise<Response> => {
    return fetch('/api/reservations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const createReservation = async (reservation: Reservation): Promise<Response> => {
    return fetch('/api/reservations/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(reservation)
    })
}

export const updateReservation = async (reservation: Reservation): Promise<Response> => {
    const temp = {...reservation}
    delete temp.reservationId
    return fetch(`/api/reservations/${reservation.reservationId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(temp)
    })
}

export const searchReservations = async (searchQueries: {
    startDate?: Date,
    endDate?: Date,
    guestId?: number,
    checkInDate?: Date,
    checkOutDate?: Date,
}): Promise<Response> => {
    // add query params to url. do not add if the query param is null or undefined
    let url = `/api/reservations/search?`
    if (searchQueries.startDate) {
        url += `startDate=${searchQueries.startDate}&`
    }

    if (searchQueries.endDate) {
        url += `endDate=${searchQueries.endDate}&`
    }

    if (searchQueries.guestId) {
        url += `guestId=${searchQueries.guestId}&`
    }

    if (searchQueries.checkInDate) {
        const day = String(searchQueries.checkInDate.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
        const month = String(searchQueries.checkInDate.getMonth() + 1).padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if needed
        const year = searchQueries.checkInDate.getFullYear(); // Get full year
        // Format the date as YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;
        url += `checkInDate=${formattedDate}&`
    }

    if (searchQueries.checkOutDate) {
        const day = String(searchQueries.checkOutDate.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
        const month = String(searchQueries.checkOutDate.getMonth() + 1).padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if needed
        const year = searchQueries.checkOutDate.getFullYear(); // Get full year
        // Format the date as YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}`;
        url += `checkOutDate=${formattedDate}&`
    }

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}