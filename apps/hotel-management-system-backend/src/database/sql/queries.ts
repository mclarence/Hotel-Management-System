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
            CREATE TABLE IF NOT EXISTS logs (
                log_id SERIAL PRIMARY KEY,
                event_type VARCHAR(255) NOT NULL, 
                timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp,
                user_id INTEGER NOT NULL,
                description TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS calendar_notes(
                note_id SERIAL PRIMARY KEY,
                date TIMESTAMP NOT NULL,
                note VARCHAR(255)
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
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS payment_methods (
                payment_method_id SERIAL PRIMARY KEY,
                guest_id INTEGER NOT NULL,
                type VARCHAR(255) NOT NULL,
                card_number VARCHAR(255),
                card_cvv VARCHAR(255),
                card_expiration DATE,
                card_holder_name VARCHAR(255),
                bank_account_number VARCHAR(255),
                bank_bsb VARCHAR(255),
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS transaction (
                transaction_id SERIAL PRIMARY KEY,
                payment_method_id INTEGER NOT NULL,
                guest_id INTEGER NOT NULL,
                amount FLOAT NOT NULL,
                description VARCHAR(255) NOT NULL,
                date TIMESTAMP NOT NULL,
                FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
                FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS tickets (
                ticket_id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                status VARCHAR(255) NOT NULL,
                date_opened TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS ticket_messages (
                ticket_message_id SERIAL PRIMARY KEY,
                ticket_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                message VARCHAR(255) NOT NULL,
                date_created TIMESTAMP NOT NULL,
                FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS guest_service (
                service_id SERIAL PRIMARY KEY,
                service_description VARCHAR(255) NOT NULL,
                service_price FLOAT NOT NULL,
                service_quantity INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS guest_service_order (
                order_id SERIAL PRIMARY KEY,
                reservation_id INTEGER NOT NULL,
                service_id INTEGER NOT NULL,
                order_time TIMESTAMP NOT NULL,
                order_status VARCHAR(255) NOT NULL,
                order_quantity INTEGER NOT NULL,
                order_price FLOAT NOT NULL,
                description TEXT NOT NULL,
                FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE CASCADE,
                FOREIGN KEY (service_id) REFERENCES guest_service(service_id) ON DELETE CASCADE
            );
        `,
    },
    guestService: {
        getGuestServices: `
            SELECT * FROM guest_service
        `,
        getGuestServiceById: `
            SELECT * FROM guest_service WHERE service_id = $1
        `,
        addGuestService: `
            INSERT INTO guest_service (service_description, service_price, service_quantity)
            VALUES ($1, $2, $3)
            RETURNING *
        `,
        updateGuestService: `
            UPDATE guest_service
            SET service_description = $1, service_price = $2, service_quantity = $3
            WHERE service_id = $4
            RETURNING *
        `,
        deleteGuestService: `
            DELETE FROM guest_service
            WHERE service_id = $1
        `,
        checkGuestServiceExistsById: `
            SELECT EXISTS(SELECT 1 FROM guest_service WHERE service_id = $1)
        `,
        searchGuestService: `
            SELECT * FROM guest_service WHERE service_description ILIKE '%$1#%'
        `
    },
    guestServiceOrder: {
        getGuestServices: `
            SELECT * FROM guest_service_order
        `,
        getGuestServiceById: `
            SELECT * FROM guest_service_order WHERE order_id = $1
        `,
        addGuestService: `
            INSERT INTO guest_service_order (reservation_id, service_id, order_time, order_status, order_price, description, order_quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `,
        updateGuestService: `
            UPDATE guest_service_order
            SET reservation_id = $1, service_id = $2, order_time = $3, order_status = $4, order_price = $5, description = $6, order_quantity = $7
            WHERE order_id = $8
            RETURNING *
        `,
        deleteGuestService: `
            DELETE FROM guest_service_order
            WHERE order_id = $1
        `,
        checkGuestServiceExistsById: `
            SELECT EXISTS(SELECT 1 FROM guest_service_order WHERE order_id = $1)
        `
    },
    tickets: {
        getTicketById: `
            SELECT * FROM tickets WHERE ticket_id = $1
        `,
        addTicket: `
            INSERT INTO tickets (user_id, title, description, status, date_opened)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateTicket: `
            UPDATE tickets
            SET user_id = $1, title = $2, description = $3, status = $4, date_opened = $5
            WHERE ticket_id = $6
            RETURNING *
        `,
        deleteTicket: `
            DELETE FROM tickets
            WHERE ticket_id = $1
        `,
        getAllTickets: `
            SELECT tickets.*, users.first_name as user_first_name, users.last_name as user_last_name FROM tickets
            INNER JOIN users ON tickets.user_id = users.user_id
        `,
        addCommentToTicket: `
            INSERT INTO ticket_messages (ticket_id, user_id, message, date_created)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        fetchTicketComments: `
            SELECT ticket_messages.*, users.first_name as user_first_name, users.last_name as user_last_name FROM ticket_messages
            INNER JOIN users ON ticket_messages.user_id = users.user_id
        `,
        checkTicketExistsById: `
            SELECT EXISTS(SELECT 1 FROM tickets WHERE ticket_id = $1)
        `,
        deleteTicketCommentsByTicketId: `
            DELETE FROM ticket_messages
            WHERE ticket_id = $1
        `,
    },
    roles: {
        checkRoleExistsByName: `
            SELECT EXISTS(SELECT 1 FROM roles WHERE name = $1)
        `,
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
            SELECT * FROM users
            WHERE username = $1
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
            SELECT users.*, roles.name as role_name FROM users
            INNER JOIN roles ON users.role_id = roles.role_id
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
    logs: {
        addLog: `
            INSERT INTO logs (event_type, timestamp, user_id, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
        getAllLogs: `
            SELECT * FROM logs
        `,
        deleteLog: `
        DELETE FROM logs
         WHERE log_id = $1
        `,
    },
    notes: {
        getNoteById: `
            SELECT * FROM calendar_notes WHERE DATE(date) = DATE($1);
        `,
        addNote: `
            INSERT INTO calendar_notes (date, note)
            VALUES ($1, $2)
            RETURNING *
        `,
        deleteNote: `
            DELETE FROM calendar_notes
            WHERE note_id = $1
        `,
        checkNoteExistsById:`
            SELECT EXISTS(SELECT 1 FROM calendar_notes WHERE note_id = $1)
        `,
        updateNote: `
            UPDATE calendar_notes
            SET note = $1
            WHERE note_id = $2
            RETURNING *
        `
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
            SELECT reservations.*, rooms.room_code, guests.first_name as guest_first_name, guests.last_name as guest_last_name FROM reservations
            INNER JOIN guests ON reservations.guest_id = guests.guest_id
            INNER JOIN rooms ON reservations.room_id = rooms.room_id
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
            SET room_id = $1, guest_id = $2, start_date = $3, end_date = $4, reservation_status = $5, check_in_date = $6, check_out_date = $7
            WHERE reservation_id = $8
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
        getReservationsByGuestId: `
            SELECT * FROM reservations WHERE guest_id = $1        
        `,
        checkIfReservationIsAvailable: `
            SELECT EXISTS(
                SELECT 1 FROM reservations
                WHERE room_id = $1
                AND (start_date, end_date) OVERLAPS ($2, $3))
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
        getStatusCount: `
        SELECT status, COUNT(*) AS count
            FROM rooms
            GROUP BY status
            ORDER BY status;
        `,
        getReservationsByRoomId: `
            SELECT * FROM reservations WHERE room_id = $1
        `,
    },
    paymentMethods: {
        getPaymentMethods: `
            SELECT * FROM payment_methods
        `,
        getPaymentMethodById: `
            SELECT * FROM payment_methods WHERE payment_method_id = $1
        `,
        getPaymentMethodsByGuestId: `
            SELECT * FROM payment_methods WHERE guest_id = $1
        `,
        addPaymentMethod: `
            INSERT INTO payment_methods (guest_id, type, card_number, card_cvv, card_expiration, card_holder_name, bank_account_number, bank_bsb)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `,
        updatePaymentMethod: `
            UPDATE payment_methods
            SET guest_id = $1, type = $2, card_number = $3, card_cvv = $4, card_expiration = $5, card_holder_name = $6, bank_account_number = $7, bank_bsb = $8
            WHERE payment_method_id = $9
            RETURNING *
        `,
        deletePaymentMethod: `
            DELETE FROM payment_methods
            WHERE payment_method_id = $1
        `,
        checkPaymentMethodExistsById: `
            SELECT EXISTS(SELECT 1 FROM payment_methods WHERE payment_method_id = $1)
        `
    },
    transactions: {
        getTransactions: `
            SELECT transaction.*, payment_methods.type as payment_method_type, guests.first_name as guest_first_name, guests.last_name as guest_last_name FROM transaction
            INNER JOIN payment_methods ON transaction.payment_method_id = payment_methods.payment_method_id
            INNER JOIN guests ON transaction.guest_id = guests.guest_id
            `,
        getTransactionById: `
            SELECT * FROM transaction WHERE transaction_id = $1
        `,
        getTransactionsByGuestId: `
            SELECT * FROM transaction WHERE guest_id = $1
        `,
        addTransaction: `
            INSERT INTO transaction (payment_method_id, guest_id, amount, description, date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        updateTransaction: `
            UPDATE transaction
            SET payment_method_id = $1, guest_id = $2, amount = $3, description = $4, date = $5
            WHERE transaction_id = $6
            RETURNING *
        `,
        deleteTransaction: `
            DELETE FROM transaction
            WHERE transaction_id = $1
        `,
        checkTransactionExistsById: `
            SELECT EXISTS(SELECT 1 FROM transaction WHERE transaction_id = $1)
        `
        
    }
    
    
}

export default queries;