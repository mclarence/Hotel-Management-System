import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {addGuest, addPaymentMethod, getPaymentMethodsByGuestId, login, makeNewGuest, makePaymentMethod} from "./common";
import request from "supertest";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

describe("payment method system", () => {
    it("should add a payment method", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        await addPaymentMethod(app, token, makePaymentMethod(guest.guestId))
    })

    it("should get a payment method by id", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const paymentMethod = await addPaymentMethod(app, token, makePaymentMethod(guest.guestId))
        const paymentMethodById = await getPaymentMethodsByGuestId(app, token, guest.guestId)

        expect(paymentMethodById[0]).toEqual(paymentMethod)
    })

    it("should delete a payment method", async () => {
        const token = await login(app);
        const guest = await addGuest(app, token, makeNewGuest())
        const paymentMethod = await addPaymentMethod(app, token, makePaymentMethod(guest.guestId))

        await request(app)
            .delete(`/api/payment-methods/${paymentMethod.paymentMethodId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })
})