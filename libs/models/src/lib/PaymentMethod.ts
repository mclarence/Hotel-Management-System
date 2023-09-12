export type PaymentMethod = {
    paymentMethodId: Number;
    guestId: Number;
    type: String;
    cardNumber: String;
    cardCVV: String;
    cardExpiration: Date;
    cardHolderName: String;
    cashAmount: Number;
    bankAccountNumber: String;
    bankBSB: String;
}