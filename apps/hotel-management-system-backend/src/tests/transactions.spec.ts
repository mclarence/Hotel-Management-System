import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {Transaction} from "@hotel-management-system/models";
import {faker} from "@faker-js/faker";
import dayjs from "dayjs";
import request from "supertest";
import {login} from "./authentication.spec";
import {addGuest, makeNewGuest} from "./guestManagement.spec";
import {addPaymentMethod, makePaymentMethod} from "./paymentMethod.spec";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

export const makeNewTransaction = (guestId: number, paymethodMethodId): Transaction => {
    return {
        amount: faker.number.int(100),
        date: dayjs.utc().toDate(),
        description: "Test Description",
        guestId: guestId,
        paymentMethodId: paymethodMethodId
    }
}

export const addTransaction = async (token: string, transaction: Transaction): Promise<Transaction> => {
    const response = await request(app)
        .post('/api/transactions/add')
        .set('Authorization', `Bearer ${token}`)
        .send(transaction)
        .expect(201)

    return response.body.data;
}

describe("transaction management", () => {
    it("should add a transaction", async () => {
        const token = await login();
        const newGuest = makeNewGuest()
        const guest = await addGuest(token, newGuest)
        const newPaymentMethod = makePaymentMethod(guest.guestId)
        const paymentMethod = await addPaymentMethod(token, newPaymentMethod)

        const newTransaction = makeNewTransaction(guest.guestId, paymentMethod.paymentMethodId)

        const transaction = await addTransaction(token, newTransaction)

        expect(transaction.amount).toEqual(newTransaction.amount)
        expect(dayjs.utc(transaction.date).toDate()).toEqual(newTransaction.date)
        expect(transaction.description).toEqual(newTransaction.description)
        expect(transaction.guestId).toEqual(newTransaction.guestId)
        expect(transaction.paymentMethodId).toEqual(newTransaction.paymentMethodId)
    })
})