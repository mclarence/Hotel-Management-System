import {Ticket, TicketMessages} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;

export interface ITicketsDAO {
    getTicketById(id: number): Promise<Ticket | null>;

    addTicket(ticket: Ticket): Promise<Ticket>;

    updateTicket(ticket: Ticket): Promise<Ticket>;

    deleteTicket(id: number): Promise<void>;

    getAllTickets(): Promise<Ticket[]>;

    addCommentToTicket(ticketMessage: TicketMessages): Promise<TicketMessages>;

    checkTicketExistsById(id: number): Promise<boolean>;

    getTicketComments(ticketId: number): Promise<TicketMessages[]>;
}

export const makeTicketsDAO = (db: IDatabase<any, any>): ITicketsDAO => {
    const getTicketById = async (id: number): Promise<Ticket | null> => {
        try {
            return await db.one(queries.tickets.addTicket, [id]);
        } catch (error) {
            if (error instanceof QueryResultError && error.code === pgPromise.errors.queryResultErrorCode.noData) {
                return null;
            }
            throw error;
        }
    }

    const addTicket = async (ticket: Ticket): Promise<Ticket> => {
        return await db.one(queries.tickets.addTicket, [ticket.userId, ticket.title, ticket.description, ticket.status, ticket.dateOpened]);
    }

    const updateTicket = async (ticket: Ticket): Promise<Ticket> => {
        return await db.one(queries.tickets.updateTicket, [ticket.userId, ticket.title, ticket.description, ticket.status, ticket.dateOpened, ticket.ticketId]);
    }

    const deleteTicket = async (id: number): Promise<void> => {
        await db.none(queries.tickets.deleteTicket, [id]);
    }

    const getAllTickets = async (): Promise<Ticket[]> => {
        return await db.any(queries.tickets.getAllTickets);
    }

    const addCommentToTicket = async (ticketMessage: TicketMessages): Promise<TicketMessages> => {
        return await db.one(queries.tickets.addCommentToTicket, [ticketMessage.ticketId, ticketMessage.userId, ticketMessage.message, ticketMessage.dateCreated]);
    }

    const checkTicketExistsById = async (id: number): Promise<boolean> => {
        const result = await db.one(queries.tickets.checkTicketExistsById, [id]);
        return result.exists;
    }

    const getTicketComments = async (ticketId: number): Promise<TicketMessages[]> => {
        return await db.any(queries.tickets.fetchTicketComments, [ticketId]);
    }

    return {
        getTicketById,
        addTicket,
        updateTicket,
        deleteTicket,
        getAllTickets,
        addCommentToTicket,
        checkTicketExistsById,
        getTicketComments
    }

}