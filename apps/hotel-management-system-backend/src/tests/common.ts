import request from "supertest";
import {Express} from "express";
import {
    CalendarNotes,
    Guest,
    PaymentMethod,
    Reservation,
    Role,
    Room,
    RoomStatuses, Ticket, TicketMessages, TicketStatuses, Transaction, User
} from "@hotel-management-system/models";
import {faker} from "@faker-js/faker";
import {PaymentMethodTypes} from "../../../../libs/models/src/lib/enums/PaymentMethodTypes";
import {ReservationStatuses} from "../../../../libs/models/src/lib/enums/ReservationStatuses";
import dayjs from "dayjs";

export const login = async (app: Express): Promise<string> => {
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

export const logout = async (app: Express, token: string): Promise<void> => {
    await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
}

export const makeNewCalendarNote = (date: Date): CalendarNotes => {
    return {
        date: date,
        note: faker.string.alphanumeric(10)
    }
}

export const addNoteToCalendar = async (app: Express, token: string, note: CalendarNotes): Promise<CalendarNotes> => {
    const response = await request(app)
        .post('/api/calendar/add')
        .set('Authorization', `Bearer ${token}`)
        .send(note)
        .expect(201)

    return response.body.data;
}

export const makeNewGuest = (): Guest => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress()
    }
}
export const addGuest = async (app: Express, token: string, guest: Guest): Promise<Guest> => {
    const response = await request(app)
        .post("/api/guests/add")
        .set("Authorization", `Bearer ${token}`)
        .send(guest)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const getGuest = async (app: Express, token: string, guestId: number): Promise<Guest> => {
    const response = await request(app)
        .get(`/api/guests/${guestId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)

    return response.body.data;
}

export const addPaymentMethod = async (app: Express, token: string, paymentMethod: any): Promise<PaymentMethod> => {
    const response = await request(app)
        .post('/api/payment-methods/add')
        .set('Authorization', `Bearer ${token}`)
        .send(paymentMethod)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const getPaymentMethodsByGuestId = async (app: Express, token: string, guestId: number): Promise<PaymentMethod[]> => {
    const response = await request(app)
        .get(`/api/guests/${guestId}/payment-methods`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

    return response.body.data;
}

export const makePaymentMethod = (guestId: number): PaymentMethod => {
    let cardNumber = faker.finance.creditCardNumber({issuer: "visa"})
    // remove the - from the card number
    cardNumber = cardNumber.replace(/-/g, "")

    return {
        guestId: guestId,
        type: PaymentMethodTypes.CREDIT_CARD,
        cardNumber: cardNumber,
        cardCVV: faker.finance.creditCardCVV(),
        cardExpiration: faker.date.future()
    }
}

export const makeNewReservation = (roomId: number, guestId: number): Reservation => {
    return {
        guestId: guestId,
        roomId: roomId,
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        reservationStatus: ReservationStatuses.PENDING,
    }
}

export const addReservation = async (app: Express, token: string, reservation: Reservation): Promise<Reservation> => {
    const response = await request(app)
        .post('/api/reservations/add')
        .set('Authorization', `Bearer ${token}`)
        .send(reservation)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const updateReservation = async (app: Express, token: string, reservation: Reservation): Promise<Reservation> => {
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

export const addRole = async (app: Express, token: string, name: string, permissionData: string[]): Promise<Role> => {
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

export const getRole = async (app: Express, token: string, roleId: number): Promise<Role> => {
    const response = await request(app)
        .get(`/api/roles/${roleId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)

    return response.body.data;
}

export const makeNewRoom = (): Room => {
    return {
        roomCode: faker.string.alphanumeric(5),
        status: RoomStatuses.AVAILABLE,
        pricePerNight: 100,
        description: "room description",
    }
}

export const addRoom = async (app: Express, token: string, room: Room): Promise<Room> => {
    const response = await request(app)
        .post('/api/rooms/add')
        .set('Authorization', `Bearer ${token}`)
        .send(room)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const makeNewTicket = (userId: number): Ticket => {
    return {
        dateOpened: dayjs.utc().toDate(),
        description: faker.string.alphanumeric(10),
        status: TicketStatuses.OPEN,
        title: faker.string.alphanumeric(10),
        userId: userId
    }
}

export const addTicket = async (app: Express, token: string, ticket: Ticket): Promise<Ticket> => {
    const response = await request(app)
        .post('/api/tickets/add')
        .set('Authorization', `Bearer ${token}`)
        .send(ticket)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)

    return response.body.data;
}

export const addCommentToTicket = async (app: Express, token: string, userId: number, ticketId: number, comment: string): Promise<TicketMessages> => {
    const response = await request(app)
        .post(`/api/tickets/${ticketId}/comments/add`)
        .set('Authorization', `Bearer ${token}`)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .send({
            message: comment,
            userId: userId,
            dateCreated: dayjs.utc().toDate()
        } as TicketMessages)

    return response.body.data;
}

export const makeNewTransaction = (guestId: number, paymentMethod: number): Transaction => {
    return {
        amount: faker.number.int(100),
        date: dayjs.utc().toDate(),
        description: "Test Description",
        guestId: guestId,
        paymentMethodId: paymentMethod
    }
}

export const addTransaction = async (app: Express, token: string, transaction: Transaction): Promise<Transaction> => {
    const response = await request(app)
        .post('/api/transactions/add')
        .set('Authorization', `Bearer ${token}`)
        .send(transaction)
        .expect(201)

    return response.body.data;
}

export const makeNewUser = (): User => {
    return {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        position: faker.person.jobTitle(),
        roleId: 1
    }
}

export const addUser = async (app: Express, token: string, user: User): Promise<User> => {
    const response = await request(app)
        .post("/api/users/add")
        .set("Authorization", `Bearer ${token}`)
        .send(user)
        .expect((res) => (res.status != 201 ? console.log(res.body) : 0))
        .expect(201)
    return response.body.data;
}

export const getUsers = async (app: Express, token: string): Promise<User[]> => {
    const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .expect((res) => (res.status != 200 ? console.log(res.body) : 0))
        .expect(200)
    return response.body.data;
}