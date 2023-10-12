import {Reservation} from "@hotel-management-system/models"
import {Dayjs} from "dayjs";

// gets all reservations
export const getReservations = async (): Promise<Response> => {
    return fetch('/api/reservations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// delete reservation
export const deleteReservation = async (reservationId: number): Promise<Response> => {
    return fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// creates a reservation
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

// updates a reservation
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


// searches for reservations
export const searchReservations = async (searchQueries: {
    startDate?: Date,
    endDate?: Date,
    guestId?: number,
    checkInDate?: Dayjs,
    checkOutDate?: Dayjs,
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
        url += `checkInDate=${searchQueries.checkInDate.format('YYYY-MM-DD')}&`
    }

    if (searchQueries.checkOutDate) {
        url += `checkOutDate=${searchQueries.checkOutDate.format('YYYY-MM-DD')}&`
    }

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}