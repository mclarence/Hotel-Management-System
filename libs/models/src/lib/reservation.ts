import {ReservationStatuses} from "./enums/ReservationStatuses";

export type Reservation = {
    reservationId?: number,
    roomId: number,
    guestId: number,
    guestFirstName?: string,
    guestLastName?: string,
    roomCode?: string,
    checkInDate?: Date,
    checkOutDate?: Date,
    reservationStatus: ReservationStatuses,
    startDate: Date,
    endDate: Date
}