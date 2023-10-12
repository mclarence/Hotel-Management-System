import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import request from "supertest";
import {addCommentToTicket, addTicket, login, makeNewTicket} from "./common";

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

    it("should update a ticket", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))

        const updatedTicket = {...ticket}
        updatedTicket.title = "new title"

        delete updatedTicket.ticketId

        const response = await request(app)
            .patch(`/api/tickets/${ticket.ticketId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTicket)
            .expect(200)

        expect(response.body.data.title).toEqual(updatedTicket.title)
    })

    it("should delete a ticket", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))

        const response = await request(app)
            .delete(`/api/tickets/${ticket.ticketId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get(`/api/tickets/${ticket.ticketId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect((res) => (res.status != 404 ? console.log(res.body) : 0))
            .expect(404)
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

    it("should add a ticket comment", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))
        const comment = await addCommentToTicket(app, token, 1, ticket.ticketId, "test comment")

        expect(comment).toHaveProperty("ticketMessageId")
        expect(comment.message).toEqual("test comment")
    })

    it("should get all tickets", async () => {
        const token = await login(app)
        const ticket = await addTicket(app, token, makeNewTicket(1))

        const response = await request(app)
            .get(`/api/tickets`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(response.body.data.length).toBeGreaterThanOrEqual(1)
    })
})