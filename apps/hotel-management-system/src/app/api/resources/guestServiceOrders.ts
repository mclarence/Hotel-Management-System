// Function to get all guest service orders
import {GuestServiceOrder} from "@hotel-management-system/models";

export const getGuestServiceOrders = (): Promise<Response> => {
    return fetch('/api/guest-service-orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

// Function to get a specific guest service order by ID
export const getGuestServiceOrderById = (orderId: number): Promise<Response> => {
    return fetch(`/api/guest-service-orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

// Function to add a new guest service order
export const addGuestServiceOrder = (orderData: GuestServiceOrder): Promise<Response> => {
    return fetch('/api/guest-service-orders/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(orderData)
    });
}

// Function to update a guest service order
export const updateGuestServiceOrder = (orderData: GuestServiceOrder): Promise<Response> => {
    // remove the id property from the orderData object
    const {orderId, ...orderDataWithoutId} = orderData;
    return fetch(`/api/guest-service-orders/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(orderDataWithoutId)
    });
}

// Function to delete a guest service order
export const deleteGuestServiceOrder = (orderId: number): Promise<Response> => {
    return fetch(`/api/guest-service-orders/${orderId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}
