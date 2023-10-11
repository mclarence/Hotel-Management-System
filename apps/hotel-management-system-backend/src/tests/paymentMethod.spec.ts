import {Express} from "express";
import startServer from "../startServer";
import {serverConfig} from "./serverConfig";
import {login} from "./authentication.spec";
import request from "supertest";
import {PaymentMethod} from "@hotel-management-system/models";
import {addGuest, makeNewGuest} from "./guestManagement.spec";
import {PaymentMethodTypes} from "../../../../libs/models/src/lib/enums/PaymentMethodTypes";
import {faker} from "@faker-js/faker";

let app: Express;
beforeAll(async () => {
    return await startServer(serverConfig).then(
        (server) => {
            app = server.app;
        }
    )
})

export const addPaymentMethod = async (token: string, paymentMethod: any): Promise<PaymentMethod> => {
    const response = await request(app)
        .post('/api/payment-methods/add')
        .set('Authorization', `Bearer ${token}`)
        .send(paymentMethod)
        .expect(201)

    return response.body.data;
}

export const getPaymentMethodsByGuestId = async (token: string, guestId: number): Promise<PaymentMethod[]> => {
    const response = await request(app)
        .get(`/api/guests/${guestId}/payment-methods`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

    return response.body.data;
}

export const makePaymentMethod = (guestId: number): PaymentMethod => {
    return {
        guestId: guestId,
        type: PaymentMethodTypes.CREDIT_CARD,
        cardNumber: faker.finance.creditCardNumber(),
        cardCVV: faker.finance.creditCardCVV(),
        cardExpiration: faker.date.future()
    }
}

describe("payment method system", () => {
    it("should add a payment method", async () => {
        const token = await login();
        const guest = await addGuest(token, makeNewGuest())
        await addPaymentMethod(token, makePaymentMethod(guest.guestId))
    })

    it("should get a payment method by id", async () => {
        const token = await login();
        const guest = await addGuest(token, makeNewGuest())
        const paymentMethod = await addPaymentMethod(token, makePaymentMethod(guest.guestId))
        const paymentMethodById = await getPaymentMethodsByGuestId(token, guest.guestId)

        expect(paymentMethodById[0]).toEqual(paymentMethod)
    })
})