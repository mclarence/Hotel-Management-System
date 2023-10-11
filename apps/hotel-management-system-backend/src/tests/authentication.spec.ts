import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import request from "supertest";
import {login, logout} from "./common";

let app: Express;

// start the server before all tests
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})



describe("authentication", () => {
    // test login function
    it("should return a jwt token when the correct credentials are provided", async () => {
        await login(app);
    })

    // test accessing a protected endpoint when logged in
    it("should allow access to a protected endpoint when the jwt token is provided", async () => {
        const token = await login(app);
        await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    // test logging out
    it("should logout the user when the logout endpoint is called", async () => {
        const token = await login(app);
        await logout(app, token);
    })

    // test logging out and then accessing a protected endpoint
    it("should not allow access to a protected endpoint when the jwt token is not provided", async () => {
        const token = await login(app);
        await logout(app, token);
        await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
    })
})