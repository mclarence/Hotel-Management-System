import {User} from "@hotel-management-system/models";
import {db} from "./db";
import pgPromise from "pg-promise";
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;

/**
 * Get all users
 * @returns A promise that resolves to a list of users
 */
export const getUsers = (): Promise<User[]> => {
    return new Promise<User[]>((resolve, reject) => {
        db.any(`
            SELECT * FROM users
           `).then((users: User[]) => {
            resolve(users);
        }).catch((err: any) => {
            reject(err);
        })
    })
};

/**
 * Get a user by id
 *
 * @param userId The id of the user
 * @returns A promise that resolves to the user if found, or null if not found
 */
export const getUserById = (userId: number): Promise<User | null> => {
    return new Promise<User>((resolve, reject) => {
        db.one(`
            SELECT * FROM users WHERE user_id = $1`
            , [userId]
        ).then((user: User) => {
            resolve(user);
        }).catch((err: any) => {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                resolve(null);
            } else {
                reject(err);
            }
        })
    })
}

/**
 * Get a user by username
 * @param username
 * @returns A promise that resolves to the user if found, or null if not found
 */
export const getUserByUsername = (username: string): Promise<User | null> => {
    return new Promise<User>((resolve, reject) => {
        db.one(`
            SELECT * FROM users WHERE username = $1
        `, [username]
        ).then((user: User) => {
            resolve(user);
        }).catch((err: any) => {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                resolve(null);
            } else {
                reject(err);
            }
        })
    })
}

/**
 * Create a new user
 * @param user
 * @returns A promise that resolves to the created user with the id set.
 */
export const createUser = (user: User): Promise<User> => {
    return new Promise<User>((resolve, reject) => {
        db.one(`
        INSERT INTO users (username, password, password_salt, first_name, last_name, email, phone_number, position, role_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING user_id
    `, [
            user.username,
            user.password,
            user.passwordSalt,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.position,
            user.roleId
        ]).then((result: User) => {
            console.log(result);
            user.userId = result.userId;
            resolve(user);
        }).catch((err: any) => {
            reject(err);
        });
    })
}

/**
 * Check if a user with the given username exists
 *
 * @param username
 * @returns A promise that resolves to true if the user exists, or false if not.
 */
export const checkUserExists = (username: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        db.oneOrNone(`
            SELECT * FROM users WHERE username = $1
        `, [username]).then((user: User) => {
            if (user === null) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((err: any) => {
            reject(err);
        })
    })
}

export const checkUserExistsById = (userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        db.oneOrNone(`
            SELECT * FROM users WHERE user_id = $1
        `, [userId]).then((user: User) => {
            if (user === null) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((err: any) => {
            reject(err);
        })
    })
}

/**
 * Delete a user by id
 *
 * @param userId
 * @returns A promise that resolves to void
 */
export const deleteUser = (userId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        // check if the user exists
        checkUserExistsById(userId).then((exists) => {
            if (!exists) {
                reject(`User with id ${userId} not found`);
            }
        }).then(() => {
            // delete the user
            return db.none(`
            DELETE FROM users WHERE user_id = $1
        `, [userId])
        }).then(() => {
            resolve();
        }).catch((err: any) => {
            reject(err);
        })
    })
}