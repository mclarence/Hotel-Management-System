import {GuestServiceOrderStatuses} from "./enums/GuestServiceOrderStatuses";

export type GuestServiceOrder = {
    orderId?: number,
    reservationId: number,
    serviceId: number,
    orderTime: Date,
    orderStatus: GuestServiceOrderStatuses,
    orderQuantity: number,
    orderPrice: number,
    description: string
}