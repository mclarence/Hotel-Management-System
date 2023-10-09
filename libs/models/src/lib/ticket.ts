import {TicketStatuses} from "./enums/TicketStatuses";

export type Ticket = {
    ticketId?: number;
    userId: number;
    title: string;
    description: string;
    status: TicketStatuses;
    dateOpened: Date;
}