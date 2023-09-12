import { User } from "@hotel-management-system/models";

// store users in memory for now, we will move to a database later.
const users: User[] = [
    {
        userId: 1,
        username: 'test',
        password: 'test',
        firstName : 'test',
        lastName : 'test',
        email : 'test@example.com',
        phone : '12345678',
        position : 'test',
    },
    {
        userId: 2,
        username: 'test2',
        password: 'test2',
        firstName : 'test2',
        lastName : 'test2',
        email : 'test2@example.com',
        phone : '12345678',
        position : 'test2',
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
    return new Promise<User>((resolve, reject) => {
        const newUser = {
            ...user,
            userId: users.length + 1,
            username: user.username,
            password: user.password,
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            phone : user.phone,
            position : user.position
        }

        users.push(newUser);

        resolve(newUser);
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