import {PaymentMethod} from "@hotel-management-system/models";

// gets all payment methods by guest id
export const getPaymentMethodsByGuestId = async (guestId: number): Promise<Response> => {
    return fetch(`/api/guests/${guestId}/payment-methods`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// adds a payment method
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

//delete a payment method
export const deletePaymentMethod = async (paymentMethodId: number): Promise<Response> => {
    return fetch(`/api/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}