/**
 * USER MANAGEMENT TEST
 */
import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import { faker } from "@faker-js/faker";
import {addUser, login, makeNewUser} from "./common";
import request from "supertest";
import {User} from "@hotel-management-system/models";


let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

describe("user management", () => {

    // test getting a list of users
    it("should return a list of users", async () => {
        const token = await login(app);
        await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThan(0)
            })
    })

    // test adding a new user
    it("should add a new user", async () => {
        const token = await login(app);
        await addUser(app, token, makeNewUser());
    })

    // test getting a user
    it("should get a user", async () => {
        const token = await login(app);
        const user = await addUser(app, token, makeNewUser());
        await request(app)
            .get(`/api/users/${user.userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("username", user.username)
                expect(res.body.data).toHaveProperty("firstName", user.firstName)
                expect(res.body.data).toHaveProperty("lastName", user.lastName)
                expect(res.body.data).toHaveProperty("email", user.email)
                expect(res.body.data).toHaveProperty("phoneNumber", user.phoneNumber)
                expect(res.body.data).toHaveProperty("position", user.position)
                expect(res.body.data).toHaveProperty("roleId", user.roleId)
            })
    })

    // test updating a user
    it("should update a user", async () => {
        const token = await login(app);

        const user = await addUser(app, token, makeNewUser());

        const updatedUser = {
            firstName: "test",
            lastName: "test",
            email: "test@example.com",
            phoneNumber: "123456789",
            position: "test position",
            roleId: 1
        }

        await request(app)
            .patch(`/api/users/${user.userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedUser)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("firstName", updatedUser.firstName)
                expect(res.body.data).toHaveProperty("lastName", updatedUser.lastName)
                expect(res.body.data).toHaveProperty("email", updatedUser.email)
                expect(res.body.data).toHaveProperty("phoneNumber", updatedUser.phoneNumber)
                expect(res.body.data).toHaveProperty("position", updatedUser.position)
                expect(res.body.data).toHaveProperty("roleId", updatedUser.roleId)
            })
    })

    // test deleting a user
    it("should delete a user", async () => {
        const token = await login(app);
        const user = await addUser(app, token, makeNewUser());

        await request(app)
            .delete(`/api/users/${user.userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get(`/api/users/${user.userId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
    })
})
