export type TicketMessages = {
    ticketMessageId?: number;
    ticketId?: number;
    userId: number;
    userFirstName?: string;
    userLastName?: string;
    message: string;
    dateCreated: Date;
}