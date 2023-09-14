export type Reservation = {
    reservationId: Number;
    startDate: Date;
    nights: Number;
    paymentStatus: String;
    checkInTime: Date;
    checkOutTime: Date;
    createdByUserId: Number;
    guestId: Number;
    roomId: Number;
}