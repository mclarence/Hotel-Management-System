import request from "supertest";
import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Role} from "@hotel-management-system/models";
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
 * ROLE MANAGEMENT
 */
const addRole = async (token: string, name: string, permissionData: string[]): Promise<Role> => {
    const response = await request(app)
        .post("/api/roles/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name,
            permissionData
        })
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

const getRole = async (token: string, roleId: number): Promise<Role> => {
    const response = await request(app)
        .get(`/api/roles/${roleId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)

    return response.body.data;
}
describe("role management", () => {

    // test getting a list of roles
    it("should return a list of roles", async () => {
        const token = await login();
        await request(app)
            .get("/api/roles")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBe(1)
            })
    })

    // test adding a new role
    it("should add a new role", async () => {
        const token = await login();
        await addRole(token, "test", ["users.read"]);
    })

    // test getting a role
    it("should get a role", async () => {
        const token = await login();
        const role = await addRole(token, "test1", ["users.read"]);

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
        const token = await login();
        const role = await addRole(token, "test3", ["users.read"]);

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