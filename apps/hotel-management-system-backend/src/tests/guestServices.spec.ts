import startServer from "../startServer";
import {Express} from "express";
import {serverConfig} from "./serverConfig";
import {
    addGuest,
    addGuestService,
    addGuestServiceOrder, addReservation,
    addRoom,
    login,
    makeGuestService,
    makeGuestServiceOrder, makeNewGuest, makeNewReservation,
    makeNewRoom
} from "./common";
import request from "supertest";
import {GuestService} from "@hotel-management-system/models";
import {GuestServiceOrderStatuses} from "../../../../libs/models/src/lib/enums/GuestServiceOrderStatuses";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

describe("guest services", () => {
    it("should create a new guest service item", async () => {
        const token = await login(app);
        await addGuestService(app, token, makeGuestService(5))
    })

    it("should get all guest service items", async () => {
        const token = await login(app);
        await addGuestService(app, token, makeGuestService(5))

        await request(app)
            .get("/api/guest-services")
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThanOrEqual(1)
            })
    })

    it("should get a specific guest service item", async () => {
        const token = await login(app);
        const guestService = await addGuestService(app, token, makeGuestService(5))

        await request(app)
            .get(`/api/guest-services/${guestService.serviceId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("serviceId", guestService.serviceId)
            })
    })

    it("should update a guest service item", async () => {
        const token = await login(app);
        const guestService = await addGuestService(app, token, makeGuestService(5))

        const updatedGuestService: GuestService = {
            serviceId: guestService.serviceId,
            serviceDescription: "test",
            servicePrice: 10,
            serviceQuantity: 10,
        }

        const {serviceId, ...expectedGuestService} = updatedGuestService;

        await request(app)
            .patch(`/api/guest-services/${serviceId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(expectedGuestService)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("serviceDescription", updatedGuestService.serviceDescription)
                expect(res.body.data).toHaveProperty("servicePrice", updatedGuestService.servicePrice)
                expect(res.body.data).toHaveProperty("serviceQuantity", updatedGuestService.serviceQuantity)
            })
    })

    it("should delete a guest service item", async () => {
        const token = await login(app);
        const guestService = await addGuestService(app, token, makeGuestService(5))

        await request(app)
            .delete(`/api/guest-services/${guestService.serviceId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    it("should add a guest service order", async () => {
        const token = await login(app);
        const room = await addRoom(app, token, makeNewRoom())
        const guest = await addGuest(app, token, makeNewGuest())
        const reservation = await addReservation(app, token, makeNewReservation(room.roomId, guest.guestId))

        const guestServiceItem = await addGuestService(app, token, makeGuestService(5))
        const guestServiceOrder = makeGuestServiceOrder(reservation.reservationId, guestServiceItem.serviceId, 1)

        await addGuestServiceOrder(app, token, guestServiceOrder)
    })

    it("should delete a guest service order", async () => {
        const token = await login(app);
        const room = await addRoom(app, token, makeNewRoom())
        const guest = await addGuest(app, token, makeNewGuest())
        const reservation = await addReservation(app, token, makeNewReservation(room.roomId, guest.guestId))

        const guestServiceItem = await addGuestService(app, token, makeGuestService(5))
        const guestServiceOrder = makeGuestServiceOrder(reservation.reservationId, guestServiceItem.serviceId, 1)

        const guestServiceOrderResponse = await addGuestServiceOrder(app, token, guestServiceOrder)

        await request(app)
            .delete(`/api/guest-service-orders/${guestServiceOrderResponse.orderId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
    })

    it("should update a guest service order", async () => {
        const token = await login(app);
        const room = await addRoom(app, token, makeNewRoom())
        const guest = await addGuest(app, token, makeNewGuest())
        const reservation = await addReservation(app, token, makeNewReservation(room.roomId, guest.guestId))

        const guestServiceItem = await addGuestService(app, token, makeGuestService(5))
        const guestServiceOrder = makeGuestServiceOrder(reservation.reservationId, guestServiceItem.serviceId, 1)

        const guestServiceOrderResponse = await addGuestServiceOrder(app, token, guestServiceOrder)

        const updatedGuestServiceOrder = {
            orderId: guestServiceOrderResponse.orderId,
            reservationId: guestServiceOrderResponse.reservationId,
            serviceId: guestServiceOrderResponse.serviceId,
            orderTime: guestServiceOrderResponse.orderTime,
            orderStatus: GuestServiceOrderStatuses.COMPLETED,
            orderPrice: guestServiceOrderResponse.orderPrice,
            description: guestServiceOrderResponse.description,
            orderQuantity: guestServiceOrderResponse.orderQuantity,
        }

        const {orderId, ...expectedGuestServiceOrder} = updatedGuestServiceOrder;

        await request(app)
            .patch(`/api/guest-service-orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`)
            .send(expectedGuestServiceOrder)
            .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
            .expect(200)
            .expect((res) => {
                expect(res.body.data).toHaveProperty("reservationId", updatedGuestServiceOrder.reservationId)
                expect(res.body.data).toHaveProperty("serviceId", updatedGuestServiceOrder.serviceId)
                expect(res.body.data).toHaveProperty("orderTime", updatedGuestServiceOrder.orderTime)
                expect(res.body.data).toHaveProperty("orderStatus", updatedGuestServiceOrder.orderStatus)
                expect(res.body.data).toHaveProperty("orderPrice", updatedGuestServiceOrder.orderPrice)
                expect(res.body.data).toHaveProperty("description", updatedGuestServiceOrder.description)
                expect(res.body.data).toHaveProperty("orderQuantity", updatedGuestServiceOrder.orderQuantity)
            })
    })

    it("should get all guest service orders", async () => {
        const token = await login(app);
        const room = await addRoom(app, token, makeNewRoom())
        const guest = await addGuest(app, token, makeNewGuest())
        const reservation = await addReservation(app, token, makeNewReservation(room.roomId, guest.guestId))

        const guestServiceItem = await addGuestService(app, token, makeGuestService(5))
        const guestServiceOrder = makeGuestServiceOrder(reservation.reservationId, guestServiceItem.serviceId, 1)

        await addGuestServiceOrder(app, token, guestServiceOrder)

        await request(app)
            .get("/api/guest-service-orders")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBeGreaterThanOrEqual(1)
            })
    })
})