import startServer from "../startServer";
import {Guest, Role, User} from "@hotel-management-system/models";
import request from 'supertest'
import {Express} from "express";
import {serverConfig} from "./serverConfig";
import {faker} from '@faker-js/faker'
import {login} from "./authentication.spec";

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

export const makeNewGuest = (): Guest => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress()
    }
}
export const addGuest = async (token: string, guest: Guest): Promise<Guest> => {
    const response = await request(app)
        .post("/api/guests/add")
        .set("Authorization", `Bearer ${token}`)
        .send(guest)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const getGuest = async (token: string, guestId: number): Promise<Guest> => {
    const response = await request(app)
        .get(`/api/guests/${guestId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)

    return response.body.data;
}

describe("guest management", () => {

    // test adding a new guest
    it("should add a new guest", async () => {
        const token = await login();
        await addGuest(token, makeNewGuest());
    })

    // test getting a guest
    it("should get a guest", async () => {
        const token = await login();
        const guest = await addGuest(token, makeNewGuest());
        await getGuest(token, guest.guestId);
    })

    // test updating a guest
    it("should update a guest", async () => {
        const token = await login();
        const guest = await addGuest(token, makeNewGuest());

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
        const token = await login();
        await addGuest(token, makeNewGuest());
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
        const token = await login();
        const guest = await addGuest(token, makeNewGuest());
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
        const token = await login();
        const guest = await addGuest(token, makeNewGuest());

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


