export type User = {
    userId?: number;
    username: string;
    password?: string;
    passwordSalt?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    position: string;
    roleId: number;
}