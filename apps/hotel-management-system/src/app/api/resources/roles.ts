import {Role} from "@hotel-management-system/models"

// gets all roles
export const getRoles = (): Promise<Response> => {
    return fetch('/api/roles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// adds a role
export const addRole = (role: Role): Promise<Response> => {
    return fetch('/api/roles/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(role)
    })
}

// deletes a role
export const deleteRole = (roleId: number): Promise<Response> => {
    return fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}