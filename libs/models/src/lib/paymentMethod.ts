import {PaymentMethodTypes} from "./enums/PaymentMethodTypes";

export type PaymentMethod = {
    paymentMethodId?: number;
    guestId: number;
    type: PaymentMethodTypes;
    cardNumber?: string;
    cardCVV?: string;
    cardExpiration?: Date;
    cardHolderName?: string;
    bankAccountNumber?: string;
    bankBSB?: string;
}