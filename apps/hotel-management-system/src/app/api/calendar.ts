import {CalendarNotes} from "@hotel-management-system/models"

export const getNoteById = (date : Date): Promise<Response> => {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (months are 0-based) and pad with leading zero if needed
    const year = date.getFullYear(); // Get full year
    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    return fetch(`/api/calendar/${formattedDate}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const createNote = (note: CalendarNotes): Promise<Response> => {
    return fetch(`/api/calendar/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(note)
    })
}

export const deleteNote = (noteId: number): Promise<Response> => {
    return fetch(`/api/calendar/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const updateNote = (note: CalendarNotes): Promise<Response> => {
    const tempNote = {...note}
    delete tempNote.noteId;

    return fetch(`/api/calendar/${note.noteId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(tempNote)
    })
}