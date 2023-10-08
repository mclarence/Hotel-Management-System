export type Reservation = {
    reservationId?: number,
    roomId: number,
    guestId: number,
    checkInDate?: Date,
    checkOutDate?: Date,
    reservationStatus: string,
    startDate: Date,
    endDate: Date
}