import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Reservation} from "@hotel-management-system/models";
import {faker} from "@faker-js/faker";
import {ReservationStatuses} from "../../../../libs/models/src/lib/enums/ReservationStatuses";
import request from "supertest";
import {login} from "./authentication.spec";
import {addRoom, makeNewRoom} from "./roomManagement.spec";
import {addGuest, makeNewGuest} from "./guestManagement.spec";
import dayjs from "dayjs";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

const makeNewReservation = (roomId: number, guestId: number): Reservation => {
    return {
        guestId: guestId,
        roomId: roomId,
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        reservationStatus: ReservationStatuses.PENDING,
    }
}

const addReservation = async (token: string, reservation: Reservation): Promise<Reservation> => {
    const response = await request(app)
        .post('/api/reservations/add')
        .set('Authorization', `Bearer ${token}`)
        .send(reservation)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

const updateReservation = async (token: string, reservation: Reservation): Promise<Reservation> => {
    const tempReservation = {...reservation}
    delete tempReservation.reservationId
    const response = await request(app)
        .patch(`/api/reservations/${reservation.reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(tempReservation)
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)

    return response.body.data;
}

describe("reservation management", () => {
    it("should add a reservation", async () => {
        const token = await login();
        const guest = await addGuest(token, makeNewGuest())
        const room = await addRoom(token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        const reservation = await addReservation(token, newReservation)

        expect(reservation.guestId).toEqual(newReservation.guestId)
        expect(reservation.roomId).toEqual(newReservation.roomId)
        expect(dayjs.utc(reservation.startDate).toDate()).toEqual(newReservation.startDate)
        expect(dayjs.utc(reservation.endDate).toDate()).toEqual(newReservation.endDate)
        expect(reservation.reservationStatus).toEqual(newReservation.reservationStatus)
    })

    it("should update a reservation", async () => {
        const token = await login();
        const guest = await addGuest(token, makeNewGuest())
        const room = await addRoom(token, makeNewRoom())
        const newReservation = makeNewReservation(room.roomId, guest.guestId)
        const reservation = await addReservation(token, newReservation)

        const updatedReservation = {
            ...reservation,
            reservationStatus: ReservationStatuses.CHECKED_IN
        }

        const updated = await updateReservation(token, updatedReservation)

        expect(updated.reservationStatus).toEqual(updatedReservation.reservationStatus)
    })
})