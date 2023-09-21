export type PaymentMethod = {
    paymentMethodId: Number;
    guestId: Number;
    type: String;
    cardNumber: String;
    cardCVV: String;
    cardExpiration: Date;
    cardHolderName: String;
    bankAccountNumber: String;
    bankBSB: String;
}