import {Room, RoomStatuses} from "@hotel-management-system/models";
import {faker} from "@faker-js/faker";
import request from "supertest";
import {addRoom, login, makeNewRoom} from "./common";
import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})


describe("room management", () => {
    it("should add a room", async () => {
        const token = await login(app);
        const newRoom = makeNewRoom()
        const room = await addRoom(app, token, newRoom)

        expect(room.roomCode).toEqual(newRoom.roomCode)
        expect(room.status).toEqual(newRoom.status)
        expect(room.pricePerNight).toEqual(newRoom.pricePerNight)
        expect(room.description).toEqual(newRoom.description)
    })

    it("should update a room", async () => {
        const token = await login(app);
        const newRoom = makeNewRoom()
        const room = await addRoom(app, token, newRoom)

        const updatedRoom = {
            ...room,
            status: RoomStatuses.UNAVAILABLE
        }

        delete updatedRoom.roomId

        const response = await request(app)
            .patch(`/api/rooms/${room.roomId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedRoom)
            .expect(200)

        expect(response.body.data.status).toEqual(updatedRoom.status)
    })

    it("should get a room by id", async () => {
        const token = await login(app);
        const newRoom = makeNewRoom()
        const room = await addRoom(app, token, newRoom)

        const response = await request(app)
            .get(`/api/rooms/${room.roomId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(response.body.data).toEqual(room)
    })

    it("should get all rooms", async () => {
        const token = await login(app);
        const newRoom = makeNewRoom()
        const room = await addRoom(app, token, newRoom)

        const response = await request(app)
            .get(`/api/rooms`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(response.body.data.length).toBeGreaterThan(0)
    })

    it("should delete a room", async () => {
        const token = await login(app);
        const newRoom = makeNewRoom()
        const room = await addRoom(app, token, newRoom)

        await request(app)
            .delete(`/api/rooms/${room.roomId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        await request(app)
            .get(`/api/rooms/${room.roomId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    })

    it("should get room status statistics", async () => {
        const token = await login(app);
        const newRoom = makeNewRoom()
        newRoom.status = RoomStatuses.OUT_OF_SERVICE
        const room = await addRoom(app, token, newRoom)

        const response = await request(app)
            .get(`/api/rooms/room-status-count`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        // find the room status count for the room we just added
        const roomStatusCount = response.body.data.find((roomStatusCount: {status: RoomStatuses, count: string}) => {
            return roomStatusCount.status == newRoom.status
        })

        expect(roomStatusCount).toHaveProperty("count", "1")
    })
})