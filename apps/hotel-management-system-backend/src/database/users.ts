import { User } from "@hotel-management-system/models";
import { db } from "./db";
// store users in memory for now, we will move to a database later.
const users: User[] = [
    {
        userId: 1,
        username: 'test',
        password: 'test',
        passwordSalt: 'test',
        firstName : 'test',
        lastName : 'test',
        email : 'test@example.com',
        phoneNumber : '12345678',
        position : 'test',
        roleId: 1,
    },
    {
        userId: 2,
        username: 'test2',
        password: 'test2',
        passwordSalt: 'test2',
        firstName : 'test2',
        lastName : 'test2',
        email : 'test2@example.com',
        phoneNumber : '12345678',
        position : 'test2',
        roleId: 1,
    }
]

export const getUsers = new Promise<User[]>((resolve, reject) => {
    resolve(users);
});

export const getUserById = (userId: number): Promise<User | undefined> => {
    return new Promise<User>((resolve, reject) => {
        const user = users.find(u => u.userId === userId);
        if (user === undefined) {
            reject(`User with id ${userId} not found`);
        } else {
            resolve(user);
        }
    })
}

export const getUserByUsername = (username: string): Promise<User | undefined> => {
    return new Promise<User>((resolve, reject) => {
        const user = users.find(u => u.username === username);
        if (user === undefined) {
            reject(`User with username ${username} not found`);
        } else {
            resolve(user);
        }
    })
}


export const createUser = (user: User): Promise<User> => {
    return db.one(`
        INSERT INTO users (username, password, passwordSalt, firstName, lastName, email, phoneNumber, position, roleId)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING userId
    `,[
        user.username,
        user.password,
        user.passwordSalt,
        user.firstName,
        user.lastName,
        user.email,
        user.phoneNumber,
        user.position,
        user.roleId
    ])
}

export const checkUserExists = (username: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        db.oneOrNone(`
            SELECT * FROM users WHERE username = $1
        `, [username]).then((user) => {
            if (user === null) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((err) => {
            reject({
                type: 'databaseError',
                message: err,
            });
        })
    })
}

export const deleteUser = (userId: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const index = users.findIndex(u => u.userId === userId);

        if (index === -1) {
            reject(`User with id ${userId} not found`);
        } else {
            users.splice(index, 1);
            resolve();
        }
    })
}