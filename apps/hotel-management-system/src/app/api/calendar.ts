import {calendarNotes} from "@hotel-management-system/models"

export const getNoteById = (date : Date): Promise<Response> => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if needed
    const year = date.getFullYear(); // Get full year
    // Format the date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    return fetch(`/api/calendar/${formattedDate}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}