import {User} from "@hotel-management-system/models";

// gets all users
export const getUsers = (): Promise<Response> => {
    return fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// gets user by id
export const getUserById = (userId: number): Promise<Response> => {
    return fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// adds a user
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

// updates a user
export const updateUser = (user: User): Promise<Response> => {
    // copy the user object and remove the userId property
    const userWithoutId = {...user};
    delete userWithoutId.userId;

    return fetch(`/api/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(userWithoutId)
    })
}

// deletes a user
export const deleteUser = (userId: number): Promise<Response> => {
    return fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// gets the current user
export const getCurrentUser = (): Promise<Response> => {
    return fetch('/api/users/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    });
};

// searches for a user.
export const searchUser = (query: string): Promise<Response> => {
    return fetch(`/api/users/search?q=${query}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}
