const queries = {
    tables: {
        createAll: `
            CREATE TABLE IF NOT EXISTS roles (
            role_id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            permission_data text[] NOT NULL
            );
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                password_salt VARCHAR(255) NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                role_id INTEGER NOT NULL,
                FOREIGN KEY (role_id) REFERENCES roles(role_id)
            );
            CREATE TABLE IF NOT EXISTS token_revocation_list (
                token_id SERIAL PRIMARY KEY,
                token VARCHAR(255) NOT NULL,
                revokedAt TIMESTAMP NOT NULL
            );
            CREATE TABLE IF NOT EXISTS guests (
                guest_id SERIAL PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS rooms (
                room_id SERIAL PRIMARY KEY,
                room_code VARCHAR(255) UNIQUE NOT NULL,
                price_per_night FLOAT NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS reservations (
                reservation_id SERIAL PRIMARY KEY,
                room_id INTEGER NOT NULL,
                guest_id INTEGER NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                check_in_date TIMESTAMP,
                check_out_date TIMESTAMP,
                reservation_status VARCHAR(255) NOT NULL,
                FOREIGN KEY (room_id) REFERENCES rooms(room_id),
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id)
            );
        `,
    },
    roles: {
        getRoleById: `
            SELECT * FROM roles WHERE role_id = $1
        `,
        checkRoleExists: `
            SELECT EXISTS(SELECT 1 FROM roles WHERE role_id = $1)
        `,
        addRole: `
            INSERT INTO roles (name, permission_data)
            VALUES ($1, $2)
            RETURNING *
        `,
        updateRole: `
            UPDATE roles
            SET name = $1, permission_data = $2
            WHERE role_id = $3
            RETURNING *
        `,
        getAllRoles: `
            SELECT * FROM roles
        `,
        getUsersWithRoles: `
            SELECT * FROM users WHERE role_id = $1
        `,
        deleteRole: `
            DELETE FROM roles
            WHERE role_id = $1
        `,
    },
    users: {
        getUserById: `
            SELECT * FROM users WHERE user_id = $1
        `,
        getUserByUsername: `
            SELECT * FROM users WHERE username = $1
        `,
        createUser: `
            INSERT INTO users (username, password, password_salt, first_name, last_name, email, phone_number, position, role_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING user_id
        `,
        updateUser: `
            UPDATE users
            SET username = $1, password = $2, password_salt = $3, first_name = $4, last_name = $5, email = $6, phone_number = $7, position = $8, role_id = $9
            WHERE user_id = $10
            RETURNING *
        `,
        deleteUser: `
            DELETE FROM users
            WHERE user_id = $1
        `,
        getAllUsers: `
            SELECT * FROM users
        `,
        searchUsers: `
            SELECT * FROM users WHERE first_name ILIKE '%$1#%' OR last_name ILIKE '%$1#%'
        `
    },
    tokenRevocationList: {
        revokeToken: `
            INSERT INTO token_revocation_list (token, revokedAt) VALUES ($1, $2)
        `,
        checkTokenRevoked: `
            SELECT * FROM token_revocation_list WHERE token = $1
        `,
    },
    guests: {
        getGuests: `
            SELECT * FROM guests
        `,
        getGuestById: `
            SELECT * FROM guests WHERE guest_id = $1
        `,
        addGuest: `
            INSERT INTO guests (first_name, last_name, email, phone_number, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateGuest: `
            UPDATE guests
            SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5
            WHERE guest_id = $6
            RETURNING *
        `,
        deleteGuest: `
            DELETE FROM guests
            WHERE guest_id = $1
        `,
        checkGuestExistsById: `
            SELECT EXISTS(SELECT 1 FROM guests WHERE guest_id = $1)
        `,
        searchGuests: `
            SELECT * FROM guests WHERE first_name || ' ' || last_name ILIKE '%$1#%';
        `,
    },
    reservations: {
        getReservations: `
            SELECT * FROM reservations
        `,
        getReservationById: `
            SELECT * FROM reservations WHERE reservation_id = $1
        `,
        addReservation: `
            INSERT INTO reservations (room_id, guest_id, start_date, end_date, reservation_status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateReservation: `
            UPDATE reservations
            SET room_id = $1, guest_id = $2, start_date = $3, end_date = $4
            WHERE reservation_id = $5
            RETURNING *
        `,
        deleteReservation: `
            DELETE FROM reservations
            WHERE reservation_id = $1
        `,
        checkReservationExistsById: `
            SELECT EXISTS(SELECT 1 FROM reservations WHERE reservation_id = $1)
        `,
        searchReservations: `
            SELECT * FROM reservations WHERE start_date ILIKE '%$1#%' OR end_date ILIKE '%$1#%'
        `,
    },
    rooms: {
        getRooms: `
            SELECT * FROM rooms
        `,
        getRoomById: `
            SELECT * FROM rooms WHERE room_id = $1
        `,
        addRoom: `
            INSERT INTO rooms (room_code, price_per_night, description, status)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        updateRoom: `
            UPDATE rooms
            SET room_code = $1, price_per_night = $2, description = $3, status = $4
            WHERE room_id = $5
            RETURNING *
        `,
        deleteRoom: `
            DELETE FROM rooms
            WHERE room_id = $1
        `,
        checkRoomExistsById: `
            SELECT EXISTS(SELECT 1 FROM rooms WHERE room_id = $1)
        `,
        searchRooms: `
            SELECT * FROM rooms WHERE room_code ILIKE '%$1#%' OR description ILIKE '%$1#%'
        `,
        checkRoomExistsByRoomCode: `
            SELECT EXISTS(SELECT 1 FROM rooms WHERE room_code = $1)
        `,
    }
}

export default queries;