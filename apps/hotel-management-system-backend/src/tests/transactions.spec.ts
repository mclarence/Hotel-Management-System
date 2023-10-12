import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import dayjs from "dayjs";
import {
    addGuest,
    addPaymentMethod,
    addTransaction,
    login,
    makeNewGuest,
    makeNewTransaction,
    makePaymentMethod
} from "./common";
import request from "supertest";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})



describe("transaction management", () => {
    it("should add a transaction", async () => {
        const token = await login(app);
        const newGuest = makeNewGuest()
        const guest = await addGuest(app, token, newGuest)
        const newPaymentMethod = makePaymentMethod(guest.guestId)
        const paymentMethod = await addPaymentMethod(app, token, newPaymentMethod)

        const newTransaction = makeNewTransaction(guest.guestId, paymentMethod.paymentMethodId)

        const transaction = await addTransaction(app, token, newTransaction)

        expect(transaction.amount).toEqual(newTransaction.amount)
        expect(dayjs.utc(transaction.date).toDate()).toEqual(newTransaction.date)
        expect(transaction.description).toEqual(newTransaction.description)
        expect(transaction.guestId).toEqual(newTransaction.guestId)
        expect(transaction.paymentMethodId).toEqual(newTransaction.paymentMethodId)
    })

    it("should delete a transaction", async () => {
        const token = await login(app);
        const newGuest = makeNewGuest()
        const guest = await addGuest(app, token, newGuest)
        const newPaymentMethod = makePaymentMethod(guest.guestId)
        const paymentMethod = await addPaymentMethod(app, token, newPaymentMethod)

        const newTransaction = makeNewTransaction(guest.guestId, paymentMethod.paymentMethodId)

        const transaction = await addTransaction(app, token, newTransaction)

        await request(app)
            .delete(`/api/transactions/${transaction.transactionId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })

    it("should get all transactions", async () => {
        const token = await login(app);
        const newGuest = makeNewGuest()
        const guest = await addGuest(app, token, newGuest)
        const newPaymentMethod = makePaymentMethod(guest.guestId)
        const paymentMethod = await addPaymentMethod(app, token, newPaymentMethod)

        const newTransaction = makeNewTransaction(guest.guestId, paymentMethod.paymentMethodId)

        const transaction = await addTransaction(app, token, newTransaction)

        const response = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        // find the transaction we just added
        const foundTransaction = response.body.data.find((t: any) => t.transactionId === transaction.transactionId)

        expect(foundTransaction).toBeDefined()
    })
})