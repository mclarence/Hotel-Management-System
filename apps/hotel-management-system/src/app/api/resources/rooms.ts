import { Room } from "@hotel-management-system/models";

export const getRooms= (): Promise<Response> => {
    return fetch('/api/rooms', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}

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

export const deleteRoom = (roomId: number): Promise<Response> => {
    return fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

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

export const searchRoom = (roomCode: string): Promise<Response> => {
    return fetch(`/api/rooms/search?q=${roomCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

export const getRoomById = (roomId: number): Promise<Response> => {
    return fetch(`/api/rooms/${roomId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
    })
}

export const getRoomStatusCount = (): Promise<Response> => {
    return fetch(`/api/rooms/room-status-count`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
    })
}