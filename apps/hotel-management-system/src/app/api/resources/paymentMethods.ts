import {PaymentMethod} from "@hotel-management-system/models";

export const getPaymentMethodsByGuestId = async (guestId: number): Promise<Response> => {
    return fetch(`/api/guests/${guestId}/payment-methods`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const addPaymentMethod = async (paymentMethod: PaymentMethod): Promise<Response> => {
    return fetch('/api/payment-methods/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(paymentMethod)
    })
}