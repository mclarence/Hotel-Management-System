import {TicketStatuses} from "./enums/TicketStatuses";

export type Ticket = {
    ticketId?: number;
    userId: number;
    userFirstName?: string;
    userLastName?: string;
    title: string;
    description: string;
    status: TicketStatuses;
    dateOpened: Date;
}