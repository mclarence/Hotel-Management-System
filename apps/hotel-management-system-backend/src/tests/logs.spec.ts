import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {login} from "./authentication.spec";
import request from "supertest";
import {Logs} from "@hotel-management-system/models";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

describe("log system", () => {

    // test adding a new log
    it("should add a new log", async () => {
        const token = await login();
        await request(app)
            .get("/api/logs")
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                const logs: Logs[] = res.body.data;
                expect(logs.length).toBeGreaterThanOrEqual(0);
            })
    })
})