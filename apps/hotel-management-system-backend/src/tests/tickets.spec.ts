import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Ticket, TicketMessages, TicketStatuses} from "@hotel-management-system/models";
import dayjs from "dayjs";
import request from "supertest";
import {addCommentToTicket, addTicket, login, makeNewTicket} from "./common";
import {faker} from "@faker-js/faker";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})



describe("ticketing system", () => {
    it("should add a ticket", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))

        expect(ticket).toHaveProperty("ticketId")
    })

    it("should add a ticket comment", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))
        const comment = await addCommentToTicket(app, token, 1, ticket.ticketId, "test comment")

        expect(comment).toHaveProperty("ticketMessageId")
        expect(comment.message).toEqual("test comment")
    })

    it("should get ticket comments", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))
        const comment = await addCommentToTicket(app, token, 1, ticket.ticketId, "test comment")

        const response = await request(app)
            .get(`/api/tickets/${ticket.ticketId}/comments`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(response.body.data.length).toEqual(1)
        expect(response.body.data[0].message).toEqual(comment.message)
    })
})