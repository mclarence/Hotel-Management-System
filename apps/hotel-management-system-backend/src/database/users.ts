import {User} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;

export interface IUsersDAO {
    getUsers: () => Promise<User[]>,
    getUserById: (userId: number) => Promise<User | null>,
    getUserByUsername: (username: string) => Promise<User | null>,
    createUser: (user: User) => Promise<User>,
    checkUserExists: (username: string) => Promise<boolean>,
    checkUserExistsById: (userId: number) => Promise<boolean>,
    deleteUser: (userId: number) => Promise<void>,
    updateUser: (user: User) => Promise<User>
}

const makeUsersDAO = (db: IDatabase<any, any>): IUsersDAO => {
    /**
     * Get all users
     * @returns A promise that resolves to a list of users
     */
    const getUsers = (): Promise<User[]> => {
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
    const getUserById = (userId: number): Promise<User | null> => {
        return new Promise<User| null>((resolve, reject) => {
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
    const getUserByUsername = (username: string): Promise<User | null> => {
        return new Promise<User | null>((resolve, reject) => {
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
    const createUser = (user: User): Promise<User> => {
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
    const checkUserExists = (username: string): Promise<boolean> => {
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

    const checkUserExistsById = (userId: number): Promise<boolean> => {
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
    const deleteUser = (userId: number): Promise<void> => {
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

    const updateUser = (user: User): Promise<User> => {
        return new Promise<User>((resolve, reject) => {
            checkUserExistsById(user.userId).then((exists) => {
                if (!exists) {
                    reject(new Error(`User with id ${user.userId} does not exist`));
                }
            })
                .then(() => {
                    db.one(`
                            UPDATE users SET username = $1, password = $2, password_salt = $3, first_name = $4, last_name = $5, email = $6, phone_number = $7, position = $8, role_id = $9
                            WHERE user_id = $10
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
                        user.roleId,
                        user.userId
                    ]).then((result: User) => {
                        user.userId = result.userId;
                        resolve(user);
                    }).catch((err: any) => {
                        reject(err);
                    });
                })

        })
    }

    return {
        getUsers,
        getUserById,
        getUserByUsername,
        createUser,
        checkUserExists,
        checkUserExistsById,
        deleteUser,
        updateUser
    }
}

export default makeUsersDAO;