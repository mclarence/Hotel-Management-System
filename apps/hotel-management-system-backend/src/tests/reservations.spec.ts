import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Reservation} from "@hotel-management-system/models";
import {faker} from "@faker-js/faker";
import {ReservationStatuses} from "../../../../libs/models/src/lib/enums/ReservationStatuses";
import request from "supertest";
import {
    addGuest,
    addReservation,
    addRoom,
    login,
    makeNewGuest,
    makeNewReservation,
    makeNewRoom,
    updateReservation
} from "./common";
import dayjs from "dayjs";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})


describe("reservation management", () => {
    it("should add a reservation", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const room = await addRoom(app, token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        const reservation = await addReservation(app, token, newReservation)

        expect(reservation.guestId).toEqual(newReservation.guestId)
        expect(reservation.roomId).toEqual(newReservation.roomId)
        expect(dayjs.utc(reservation.startDate).toDate()).toEqual(newReservation.startDate)
        expect(dayjs.utc(reservation.endDate).toDate()).toEqual(newReservation.endDate)
        expect(reservation.reservationStatus).toEqual(newReservation.reservationStatus)
    })

    it("should update a reservation", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const room = await addRoom(app, token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        const reservation = await addReservation(app, token, newReservation)

        const updatedReservation = {
            ...reservation,
            reservationStatus: ReservationStatuses.CHECKED_IN
        }

        const updated = await updateReservation(app, token, updatedReservation)

        expect(updated.reservationStatus).toEqual(updatedReservation.reservationStatus)
    })

    it("should get reservations checked in on a specific day", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const room = await addRoom(app, token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        const reservation = await addReservation(app, token, newReservation)

        reservation.reservationStatus = ReservationStatuses.CHECKED_IN
        reservation.checkInDate = dayjs.utc().toDate()

        const updated = await updateReservation(app, token, reservation)

        const response = await request(app)
            .get(`/api/reservations/search?checkInDate=${dayjs.utc().format('YYYY-MM-DD')}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toEqual(1)
                expect(res.body.data[0].reservationId).toEqual(updated.reservationId)
            })
    })

    it("should get reservations checked out on a specific day", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const room = await addRoom(app, token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        const reservation = await addReservation(app, token, newReservation)

        reservation.reservationStatus = ReservationStatuses.CHECKED_OUT
        reservation.checkOutDate = dayjs.utc().toDate()

        const updated = await updateReservation(app, token, reservation)

        const response = await request(app)
            .get(`/api/reservations/search?checkOutDate=${dayjs.utc().format('YYYY-MM-DD')}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toEqual(1)
                expect(res.body.data[0].reservationId).toEqual(updated.reservationId)
            })
    })

    it("should not make a reservation if the room is already reserved at that time", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const room = await addRoom(app, token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        await addReservation(app, token, newReservation)
        // add the reservation again, it should fail

        await request(app)
            .post(`/api/reservations/add`)
            .set('Authorization', `Bearer ${token}`)
            .send(newReservation)
            .expect(400)

    })
})