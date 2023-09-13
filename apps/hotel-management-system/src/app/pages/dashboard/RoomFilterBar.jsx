// RoomFilterBar.js
import React from 'react';

function RoomFilterBar({ filterStatus, setFilterStatus, filterRoomType, setFilterRoomType, searchRoomNumber, setSearchRoomNumber }) {
    return (
        <div className="room-filter-bar">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Filter by Status</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Under Maintenance">Under Maintenance</option>
            </select>

            <select value={filterRoomType} onChange={(e) => setFilterRoomType(e.target.value)}>
                <option value="">Filter by Room Type</option>
                <option value="Single Bed">Single Bed</option>
                <option value="Double Bed">Double Bed</option>
            </select>

            <input 
                type="text" 
                placeholder="Room Number" 
                value={searchRoomNumber} 
                onChange={(e) => setSearchRoomNumber(e.target.value)} 
            />
        </div>
    );
}

export default RoomFilterBar;
