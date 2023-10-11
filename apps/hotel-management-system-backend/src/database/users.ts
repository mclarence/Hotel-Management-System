import {User} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import QueryResultError = pgPromise.errors.QueryResultError;
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;

export interface IUsersDAO {
    getUsers: () => Promise<User[]>;
    getUserById: (userId: number) => Promise<User | null>;
    getUserByUsername: (username: string) => Promise<User | null>;
    createUser: (user: User) => Promise<User>;
    checkUserExists: (username: string) => Promise<boolean>;
    checkUserExistsById: (userId: number) => Promise<boolean>;
    deleteUser: (userId: number) => Promise<void>;
    updateUser: (user: User) => Promise<User>;
    searchUsers: (query: string) => Promise<User[]>;
}

const makeUsersDAO = (db: IDatabase<any, any>): IUsersDAO => {
    /**
     * Get all users
     * @returns A promise that resolves to a list of users
     */
    const getUsers = async (): Promise<User[]> => {
        const users: User[] = await db.any(queries.users.getAllUsers);
        return users;
    };

    /**
     * Get a user by id
     *
     * @param userId The id of the user
     * @returns A promise that resolves to the user if found, or null if not found
     */
    const getUserById = async (userId: number): Promise<User | null> => {
        try {
            return await db.oneOrNone(queries.users.getUserById, [
                userId,
            ]);
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return null;
            } else {
                throw err;
            }
        }
    };

    /**
     * Get a user by username
     * @param username
     * @returns A promise that resolves to the user if found, or null if not found
     */
    const getUserByUsername = async (username: string): Promise<User | null> => {
        try {
            return await db.oneOrNone(queries.users.getUserByUsername, [
                username,
            ]);
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return null;
            } else {
                throw err;
            }
        }
    };

    /**
     * Create a new user
     * @param user
     * @returns A promise that resolves to the created user with the id set.
     */
    const createUser = async (user: User): Promise<User> => {
        const createdUser: User = await db.one(queries.users.createUser, [
            user.username,
            user.password,
            user.passwordSalt,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.position,
            user.roleId,
        ]);
        user.userId = createdUser.userId;
        return user;
    };

    /**
     * Check if a user with the given username exists
     *
     * @param username
     * @returns A promise that resolves to true if the user exists, or false if not.
     */
    const checkUserExists = async (username: string): Promise<boolean> => {
        try {
            await db.one(queries.users.getUserByUsername, [
                username,
            ]);
            return true;
        } catch (e) {
            if (
                e instanceof QueryResultError &&
                e.code === queryResultErrorCode.noData
            ) {
                return false;
            } else {
                throw e;
            }
        }


    };

    const checkUserExistsById = async (userId: number): Promise<boolean> => {
        try {
            await db.one(queries.users.getUserById, [userId]);
            return true;
        } catch (e) {
            if (
                e instanceof QueryResultError &&
                e.code === queryResultErrorCode.noData
            ) {
                return false;
            } else {
                throw e;
            }
        }
    };

    /**
     * Delete a user by id
     *
     * @param userId
     * @returns A promise that resolves to void
     */
    const deleteUser = async (userId: number): Promise<void> => {
        await db.none(queries.users.deleteUser, [userId]);
    };

    const updateUser = async (user: User): Promise<User> => {
        return await db.one(queries.users.updateUser, [
            user.username,
            user.password,
            user.passwordSalt,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.position,
            user.roleId,
            user.userId,
        ]);
    };

    /**
     * Search for users by first name or last name
     * @param query
     * @returns A promise that resolves to a list of users, an empty list if no users are found.
     */
    const searchUsers = async (query: string): Promise<User[]> => {
        try {
            return await db.any(queries.users.searchUsers, [
                query,
            ]);
        } catch (err) {
            if (
                err instanceof QueryResultError &&
                err.code === queryResultErrorCode.noData
            ) {
                return [];
            }
        }
    }

    return {
        getUsers,
        getUserById,
        getUserByUsername,
        createUser,
        checkUserExists,
        checkUserExistsById,
        deleteUser,
        updateUser,
        searchUsers,
    };
};

export default makeUsersDAO;
