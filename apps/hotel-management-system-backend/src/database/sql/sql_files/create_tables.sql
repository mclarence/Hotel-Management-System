CREATE TABLE IF NOT EXISTS roles (
            role_id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            permission_data JSONB NOT NULL
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
    operation_type VARCHAR(255) NOT NULL, -- e.g. 'CHECK_IN', 'CHECK_OUT' 'login'
    timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp,
    operated_by VARCHAR(255) NOT NULL, -- Username of the user who performed the operation
    guest_name VARCHAR(255), -- optional, name of the guest for check in/check out
    additional_info TEXT -- any other details we might want to store
);