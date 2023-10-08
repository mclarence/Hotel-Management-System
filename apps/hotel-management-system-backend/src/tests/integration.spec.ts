import startServer from "../startServer";
import {ServerConfig} from "@hotel-management-system/models";
import request from 'supertest'
import {Express} from "express";

const serverConfig: ServerConfig = {
    database: {
        database: "ads-db",
        host: "127.0.0.1",
        password: "mysecretpassword",
        port: 5432,
        user: "postgres"
    },
    jwt: {
        secret: "themostsupersecretstring"
    },
    server: {
        listenAddress: "127.0.0.1",
        port: 3333
    }

}

let app: Express;
beforeAll( () => {
    return startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

describe("authentication", () => {
    let token: string;
    it("should return a jwt token when the correct credentials are provided", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(200)
        expect(response.body.data).toHaveProperty("jwt")
        token = response.body.data.jwt;
        console.log(token)
    })

    it("should allow access to a protected endpoint when the jwt token is provided", async () => {
        await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    it("should logout the user when the logout endpoint is called", async () => {
        await request(app)
            .post("/api/users/logout")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    it("should not allow access to a protected endpoint when the jwt token is not provided", async () => {
        await request(app)
            .get("/api/users/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
    })
})
describe("user management", () => {
    let token: string;
    it("should return a jwt token when the correct credentials are provided", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
        expect(response.body.data).toHaveProperty("jwt")
        token = response.body.data.jwt;
        console.log(token)
    })

    it("should return a list of users", async () => {
        await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThan(0)
            })
    })

    it("should add a new user", async () => {
        await request(app)
            .post("/api/users/add")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "test",
                password: "test",
                firstName: "test",
                lastName: "test",
                email: "test@example.com",
                phoneNumber: "123456789",
                position: "test",
                roleId: 1
            })
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(201)
    })

    it("should update a user", async () => {
        await request(app)
            .patch("/api/users/2")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "test1",
                password: "test2",
                firstName: "test3",
                lastName: "test4",
                email: "test2@example.com",
                phoneNumber: "1234",
                position: "staff",
                roleId: 1
            })
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect((res) => {
                expect(res.body.data).toHaveProperty("username", "test1")
                expect(res.body.data).toHaveProperty("firstName", "test3")
                expect(res.body.data).toHaveProperty("lastName", "test4")
                expect(res.body.data).toHaveProperty("email", "test2@example.com")
                expect(res.body.data).toHaveProperty("phoneNumber", "1234")
                expect(res.body.data).toHaveProperty("position", "staff")
                expect(res.body.data).toHaveProperty("roleId", 1)
            })
    })

    it("should delete a user", async () => {
        await request(app)
            .delete("/api/users/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get("/api/users/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
    })
})

describe("role management", () => {
    let token: string;
    it("should return a jwt token when the correct credentials are provided", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
        expect(response.body.data).toHaveProperty("jwt")
        token = response.body.data.jwt;
        console.log(token)
    })

    it("should return a list of roles", async () => {
        await request(app)
            .get("/api/roles")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBe(1)
            })
    })

    it("should add a new role", async () => {
        await request(app)
            .post("/api/roles/add")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "test",
                permissionData: ["users.read"]
            })
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(201)
    })

    it("should get a role", async () => {
        await request(app)
            .get("/api/roles/2")
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("name", "test")
                expect(res.body.data).toHaveProperty("permissionData", ["users.read"])
            })
    })

    it("should delete a role", async () => {
        await request(app)
            .delete("/api/roles/2")
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(200)

        await request(app)
            .get("/api/roles/2")
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(404)
    })

})

describe("guest management", () => {
    let token: string;
    it("should return a jwt token when the correct credentials are provided", async () => {
        const response = await request(app)
            .post("/api/users/login")
            .send({
                username: "admin",
                password: "admin"
            })
            .expect(200)
        expect(response.body.data).toHaveProperty("jwt")
        token = response.body.data.jwt;
        console.log(token)
    })

    it("should add a new guest", async () => {
        await request(app)
            .post("/api/guests/add")
            .set("Authorization", `Bearer ${token}`)
            .send({
                firstName: "test",
                lastName: "test",
                email: "test@example.com",
                phoneNumber: "123456789",
                address: "test address"
            })
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(201)
    })

    it("should get a guest", async () => {
        await request(app)
            .get("/api/guests/1")
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("firstName", "test")
                expect(res.body.data).toHaveProperty("lastName", "test")
                expect(res.body.data).toHaveProperty("email", "test@example.com")
                expect(res.body.data).toHaveProperty("phoneNumber", "123456789")
                expect(res.body.data).toHaveProperty("address", "test address")
            })
    })

    it("should update a guest", async () => {
        await request(app)
            .patch("/api/guests/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                firstName: "test1",
                lastName: "test2",
                email: "test1@example.com",
                phoneNumber: "1234",
                address: "test address 1"
            })
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect((res) => {
                expect(res.body.data).toHaveProperty("firstName", "test1")
                expect(res.body.data).toHaveProperty("lastName", "test2")
                expect(res.body.data).toHaveProperty("email", "test1@example.com")
                expect(res.body.data).toHaveProperty("phoneNumber", "1234")
                expect(res.body.data).toHaveProperty("address", "test address 1")
            })
    })

    it("should list all guests", async () => {
        await request(app)
            .get("/api/guests")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThan(0)
            })
    })

    it("should search for a guest by name", async () => {
        await request(app)
            .get("/api/guests/search?q=test1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThan(0)
            })
            .expect((res) => {
                expect(res.body.data[0]).toHaveProperty("firstName", "test1")
                expect(res.body.data[0]).toHaveProperty("lastName", "test2")
            })
    })

    it("should delete a guest", async () => {
        await request(app)
            .delete("/api/guests/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get("/api/guests/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
    })
})