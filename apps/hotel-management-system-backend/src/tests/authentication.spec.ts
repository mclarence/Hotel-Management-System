import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import request from "supertest";

let app: Express;

// start the server before all tests
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})


export const login = async (): Promise<string> => {
    const token = await request(app)
        .post("/api/users/login")
        .send({
            username: "admin",
            password: "admin"
        })
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)
    return token.body.data.jwt;
}

export const logout = async (token: string): Promise<void> => {
    await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
}

describe("authentication", () => {
    // test login function
    it("should return a jwt token when the correct credentials are provided", async () => {
        await login();
    })

    // test accessing a protected endpoint when logged in
    it("should allow access to a protected endpoint when the jwt token is provided", async () => {
        const token = await login();
        await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    // test logging out
    it("should logout the user when the logout endpoint is called", async () => {
        const token = await login();
        await logout(token);
    })

    // test logging out and then accessing a protected endpoint
    it("should not allow access to a protected endpoint when the jwt token is not provided", async () => {
        const token = await login();
        await logout(token);
        await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
    })
})