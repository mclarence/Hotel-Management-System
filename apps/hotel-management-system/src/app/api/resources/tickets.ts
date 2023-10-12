import {Ticket, TicketMessages} from "@hotel-management-system/models";

// gets all tickets
export const getAllTickets = (): Promise<Response> => {
    return fetch('/api/tickets', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

// adds a ticket
export const addTicket = (ticket: Ticket): Promise<Response> => {
    return fetch('/api/tickets/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(ticket)
    })
}

// updates a ticket
export const updateTicket = (ticket: Ticket): Promise<Response> => {
    const tempTicket = {...ticket}
    delete tempTicket.ticketId

    return fetch(`/api/tickets/${ticket.ticketId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(tempTicket)
    })
}

// deletes a ticket
export const deleteTicket = (ticketId: number): Promise<Response> => {
    return fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// adds a comment to a ticket
export const addCommentToTicket = (ticketMessage: TicketMessages): Promise<Response> => {
    const tempTicketMessage = {...ticketMessage}
    delete tempTicketMessage.ticketId

    return fetch(`/api/tickets/${ticketMessage.ticketId}/comments/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(tempTicketMessage)
    })
}

// gets a ticket comments
export const getTicketComments = (ticketId: number): Promise<Response> => {
    return fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}