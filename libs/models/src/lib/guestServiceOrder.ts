export type GuestServiceOrder = {
    orderId?: number,
    reservationId: number,
    serviceId: number,
    orderTime: Date,
    orderStatus: string,
    orderQuantity: number,
    orderPrice: number,
    description: string
}