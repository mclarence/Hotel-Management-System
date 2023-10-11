import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Ticket, TicketMessages, TicketStatuses} from "@hotel-management-system/models";
import dayjs from "dayjs";
import request from "supertest";
import {login} from "./authentication.spec";
import {faker} from "@faker-js/faker";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

export const makeNewTicket = (userId: number): Ticket => {
    return {
        dateOpened: dayjs.utc().toDate(),
        description: faker.string.alphanumeric(10),
        status: TicketStatuses.OPEN,
        title: faker.string.alphanumeric(10),
        userId: userId
    }
}

export const addTicket = async (token: string, ticket: Ticket): Promise<Ticket> => {
    const response = await request(app)
        .post('/api/tickets/add')
        .set('Authorization', `Bearer ${token}`)
        .send(ticket)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const addCommentToTicket = async (token: string, userId: number, ticketId: number, comment: string): Promise<TicketMessages> => {
    const response = await request(app)
        .post(`/api/tickets/${ticketId}/comments/add`)
        .set('Authorization', `Bearer ${token}`)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .send({
            message: comment,
            userId: userId,
            dateCreated: dayjs.utc().toDate()
        } as TicketMessages)

    return response.body.data;
}

describe("ticketing system", () => {
    it("should add a ticket", async () => {
        const token = await login()
        const ticket = await addTicket(token, makeNewTicket(1))

        expect(ticket).toHaveProperty("ticketId")
    })

    it("should add a ticket comment", async () => {
        const token = await login()
        const ticket = await addTicket(token, makeNewTicket(1))
        const comment = await addCommentToTicket(token, 1, ticket.ticketId, "test comment")

        expect(comment).toHaveProperty("ticketMessageId")
        expect(comment.message).toEqual("test comment")
    })
})