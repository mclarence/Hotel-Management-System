import {ReservationStatuses} from "./enums/ReservationStatuses";

export type Reservation = {
    reservationId?: number,
    roomId: number,
    guestId: number,
    checkInDate?: Date,
    checkOutDate?: Date,
    reservationStatus: ReservationStatuses,
    startDate: Date,
    endDate: Date
}