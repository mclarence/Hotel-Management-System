import { Room } from "@hotel-management-system/models";

// gets all rooms
export const getRooms= (): Promise<Response> => {
    return fetch('/api/rooms', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

// adds a room
export const addRoom = (room: Room): Promise<Response> => {
    return fetch('/api/rooms/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(room)
    })
}

// deletes a room
export const deleteRoom = (roomId: number): Promise<Response> => {
    return fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

// updates a room
export const updateRoom = (room: Room): Promise<Response> => {
    const updatedRoom = {...room}
    delete updatedRoom.roomId
    
    return fetch(`/api/rooms/${room.roomId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify(updatedRoom)
    })
}

// searches for rooms
export const searchRoom = (roomCode: string): Promise<Response> => {
    return fetch(`/api/rooms/search?q=${roomCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

// gets a room by id
export const getRoomById = (roomId: number): Promise<Response> => {
    return fetch(`/api/rooms/${roomId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

// gets all room statuses
export const getRoomStatusCount = (): Promise<Response> => {
    return fetch(`/api/rooms/room-status-count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}