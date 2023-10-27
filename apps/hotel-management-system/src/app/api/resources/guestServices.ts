// Function to get all guest services
import {GuestService} from "@hotel-management-system/models";

export const getGuestServices = (): Promise<Response> => {
    return fetch('/api/guest-services', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

// Function to get a specific guest service by ID
export const getGuestServiceById = (serviceId: number): Promise<Response> => {
    return fetch(`/api/guest-services/${serviceId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

// Function to add a new guest service
export const addGuestService = (serviceData: GuestService): Promise<Response> => {
    return fetch('/api/guest-services/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(serviceData)
    });
}

// Function to update a guest service
export const updateGuestService = (guestService: GuestService): Promise<Response> => {
    // Exclude service_id from the request body
    const {serviceId, ...updatedData} = guestService;

    return fetch(`/api/guest-services/${serviceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(updatedData)
    });
}

// Function to delete a guest service
export const deleteGuestService = (serviceId: number): Promise<Response> => {
    return fetch(`/api/guest-services/${serviceId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

export // Function to search guest services by service description
const searchGuestServices = (query: any) => {
    return fetch(`/api/guest-services/search?q=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
}

