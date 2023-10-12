import request from "supertest";
import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Role} from "@hotel-management-system/models";
import {addRole, login} from "./common";
import {faker} from "@faker-js/faker";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

/**
 * ROLE MANAGEMENT
 */

describe("role management", () => {

    // test getting a list of roles
    it("should return a list of roles", async () => {
        const token = await login(app);
        await request(app)
            .get("/api/roles")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThanOrEqual(1)
            })
    })

    // test adding a new role
    it("should add a new role", async () => {
        const token = await login(app);
        await addRole(app, token, "test", ["users.read"]);
    })

    // test updating a role
    it("should update a role", async () => {
        const token = await login(app);
        const role = await addRole(app, token, "test2", ["users.read"]);

        const updatedRole: Role = {
            roleId: role.roleId,
            name: faker.string.alphanumeric(10),
            permissionData: ["users.read", "users.write"]
        }

        delete updatedRole.roleId;

        await request(app)
            .patch(`/api/roles/${role.roleId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(updatedRole)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("name", updatedRole.name)
                expect(res.body.data).toHaveProperty("permissionData", updatedRole.permissionData)
            })
    })

    // test getting a role
    it("should get a role", async () => {
        const token = await login(app);
        const role = await addRole(app, token, "test1", ["users.read"]);

        await request(app)
            .get(`/api/roles/${role.roleId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("name", role.name)
                expect(res.body.data).toHaveProperty("permissionData", role.permissionData)
            })
    })

    // test deleting a role
    it("should delete a role", async () => {
        const token = await login(app);
        const role = await addRole(app, token, "test3", ["users.read"]);

        await request(app)
            .delete(`/api/roles/${role.roleId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get(`/api/roles/${role.roleId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404)

    })
})