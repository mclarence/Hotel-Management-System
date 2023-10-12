import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {addRole, addUser, getUsers, login, makeNewUser} from "./common";
import {Role} from "@hotel-management-system/models";
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

describe("authorization", () => {
    it("test wildcard permission", async () => {
        const token = await login(app);

        await getUsers(app, token)
    })

    it("test specific permission", async () => {
        const token = await login(app);

        const role = await addRole(app, token, "testrolepermissions", ["users.read"]);

        const user = makeNewUser();

        user.roleId = role.roleId;
        user.username = "test";
        user.password = "test";

        await addUser(app, token, user);

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "test"
            })
            .expect(200)

        const testToken = loginResponse.body.data.jwt;

        await getUsers(app, testToken)

        // test adding a user, this should fail
        await request(app)
            .post("/api/users/add")
            .set("Authorization", `Bearer ${testToken}`)
            .send(makeNewUser())
            .expect(401)
    })
})