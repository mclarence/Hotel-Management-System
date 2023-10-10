import {Ticket, TicketMessages} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import QueryResultError = pgPromise.errors.QueryResultError;
import queries from "./sql/queries";

export interface ITicketsDAO {
    getTicketById(id: number): Promise<Ticket| null>;
    addTicket(ticket: Ticket): Promise<Ticket>;
    updateTicket(ticket: Ticket): Promise<Ticket>;
    deleteTicket(id: number): Promise<void>;
    getAllTickets(): Promise<Ticket[]>;
    addCommentToTicket(ticketMessage: TicketMessages): Promise<TicketMessages>;
    checkTicketExistsById(id: number): Promise<boolean>;
    getTicketComments(ticketId: number): Promise<TicketMessages[]>;
}

export const makeTicketsDAO = (db: IDatabase<any,any>): ITicketsDAO => {
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
        try {
            return await db.one(queries.tickets.addTicket, [ticket.userId, ticket.title, ticket.description, ticket.status, ticket.dateOpened]);
        } catch (error) {
            throw error;
        }
    }

    const updateTicket = async (ticket: Ticket): Promise<Ticket> => {
        try {
            return await db.one(queries.tickets.updateTicket, [ticket.userId, ticket.title, ticket.description, ticket.status, ticket.dateOpened, ticket.ticketId]);
        } catch (error) {
            throw error;
        }
    }

    const deleteTicket = async (id: number): Promise<void> => {
        try {
            await db.none(queries.tickets.deleteTicket, [id]);
        } catch (error) {
            throw error;
        }
    }

    const getAllTickets = async (): Promise<Ticket[]> => {
        try {
            return await db.any(queries.tickets.getAllTickets);
        } catch (error) {
            throw error;
        }
    }

    const addCommentToTicket = async (ticketMessage: TicketMessages): Promise<TicketMessages> => {
        try {
            const comment =await db.one(queries.tickets.addCommentToTicket, [ticketMessage.ticketId, ticketMessage.userId, ticketMessage.message, ticketMessage.dateCreated]);
            return comment;
        } catch (error) {
            throw error;
        }
    }

    const checkTicketExistsById = async (id: number): Promise<boolean> => {
        try {
            const result = await db.one(queries.tickets.checkTicketExistsById, [id]);
            return result.exists;
        } catch (error) {
            throw error;
        }
    }

    const getTicketComments = async (ticketId: number): Promise<TicketMessages[]> => {
        try {
            return await db.any(queries.tickets.fetchTicketComments, [ticketId]);
        } catch (error) {
            throw error;
        }
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