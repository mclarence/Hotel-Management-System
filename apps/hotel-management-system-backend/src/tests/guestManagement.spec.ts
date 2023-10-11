import startServer from "../startServer";
import {Guest, Role, User} from "@hotel-management-system/models";
import request from 'supertest'
import {Express} from "express";
import {serverConfig} from "./serverConfig";
import {faker} from '@faker-js/faker'
import {addGuest, getGuest, login, makeNewGuest} from "./common";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})


/**
 * GUEST MANAGEMENT
 */

describe("guest management", () => {

    // test adding a new guest
    it("should add a new guest", async () => {
        const token = await login(app);
        await addGuest(app, token, makeNewGuest());
    })

    // test getting a guest
    it("should get a guest", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest());
        await getGuest(app, token, guest.guestId);
    })

    // test updating a guest
    it("should update a guest", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest());

        const updatedGuest = {
            firstName: "test",
            lastName: "test",
            email: "test@example.com",
            phoneNumber: "123456789",
            address: "test address"
        }

        await request(app)
            .patch(`/api/guests/${guest.guestId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedGuest)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("firstName", updatedGuest.firstName)
                expect(res.body.data).toHaveProperty("lastName", updatedGuest.lastName)
                expect(res.body.data).toHaveProperty("email", updatedGuest.email)
                expect(res.body.data).toHaveProperty("phoneNumber", updatedGuest.phoneNumber)
                expect(res.body.data).toHaveProperty("address", updatedGuest.address)
            })
    })

    // test listing all guests
    it("should list all guests", async () => {
        const token = await login(app);
        await addGuest(app, token, makeNewGuest());
        await request(app)
            .get("/api/guests")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThan(0)
            })
    })

    // test searching for a guest by name
    it("should search for a guest by name", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest());
        await request(app)
            .get(`/api/guests/search?q=${guest.firstName}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThan(0)
            })
            .expect((res) => {
                expect(res.body.data[0]).toHaveProperty("firstName", guest.firstName)
                expect(res.body.data[0]).toHaveProperty("lastName", guest.lastName)
            })
    })

    // test deleting a guest
    it("should delete a guest", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest());

        await request(app)
            .delete(`/api/guests/${guest.guestId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get(`/api/guests/${guest.guestId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
    })
})


