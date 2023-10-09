import {User} from "@hotel-management-system/models";

export const getUsers = (): Promise<Response> => {
    return fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const addUser = (user: User): Promise<Response> => {
    return fetch('/api/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(user)
    })
}

export const deleteUser = (userId: number): Promise<Response> => {
    return fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

export const getCurrentUser = (): Promise<Response> => {
    return fetch('/api/users/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
};
