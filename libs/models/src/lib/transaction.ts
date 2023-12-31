export type Transaction = {
    transactionId?: number;
    paymentMethodId: number;
    guestId: number;
    amount: number;
    description: string;
    date: Date;
    paymentMethodType?: string;
    guestFirstName?: string;
    guestLastName?: string;
}