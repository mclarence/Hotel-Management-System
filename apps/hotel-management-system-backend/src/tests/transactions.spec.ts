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
})