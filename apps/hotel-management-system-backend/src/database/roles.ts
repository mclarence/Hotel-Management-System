import {Role, User} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
import QueryResultError = pgPromise.errors.QueryResultError;
import queries from "./sql/queries";

export interface IRolesDAO {
    getRoleById: (roleId: number) => Promise<Role | null>,
    checkRoleExists: (roleId: number) => Promise<boolean>,
    addRole: (role: Role) => Promise<Role>,
    updateRole: (role: Role) => Promise<Role>,
    getAllRoles: () => Promise<Role[]>,
    deleteRole: (roleId: number) => Promise<void>,
    getUsersWithRoles: (roleId: number) => Promise<User[]>
}

export const makeRolesDAO = (db: IDatabase<any, any>): IRolesDAO => {

    /**
     * Get role by id
     * @param roleId 
     * @returns A promise that resolves to a role or null if no role is found.
     */
    const getRoleById = async (roleId: number): Promise<Role | null> => {
        try {
            const role: Role = await db.oneOrNone(queries.roles.getRoleById, [roleId]);
            return role;
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return null;
            } else {
                throw err;
            }
        }
    }

    /**
     * Check if role exists
     * @param roleId 
     * @returns A promise that resolves to true if role exists, false otherwise.
     */
    const checkRoleExists = async (roleId: number): Promise<boolean> => {
        try {
            const result: any = await db.one(queries.roles.checkRoleExists, [roleId]);
            return result.exists;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Add role.
     * @param role 
     * @returns A promise that resolves to the added role containing the role id.
     */
    const addRole = (role: Role): Promise<Role> => {
        return new Promise<Role>((resolve, reject) => {
            db.one(`
                INSERT INTO roles (name, permission_data)
                VALUES ($1, $2)
                RETURNING *
            `, [role.name, role.permissionData]).then((role: Role) => {
                resolve(role);
            }).catch((err: any) => {
                reject(err);
            })
        })
    }

    /**
     * Update role.
     * @param role 
     * @returns A promise that resolves to the updated role.
     */
    const updateRole = async (role: Role): Promise<Role> => {
        try {
            const updatedRole: Role = await db.one(queries.roles.updateRole, [role.name, role.permissionData, role.roleId]);
            return updatedRole;
        } catch (err) {
            throw err;
        }
    }

    const getUsersWithRoles = async (roleId: number): Promise<User[]> => {
        try {
            const result: any = await db.manyOrNone(queries.roles.getUsersWithRoles, [roleId]);
            return result;
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            throw err;
        }
    }

    const deleteRole = async (roleId: number): Promise<void> => {
        try {
            const role: Role = await db.none(queries.roles.deleteRole, [roleId]);
        } catch (err) {
            throw err;
        }

    }

    /**
     * Get all roles.
     * @returns A promise that resolves to an array of roles.
     */
    const getAllRoles = async (): Promise<Role[]> => {
        const roles: Role[] = await db.manyOrNone(queries.roles.getAllRoles);
        return roles;
    }

    return {
        getRoleById,
        checkRoleExists,
        addRole,
        updateRole,
        getAllRoles,
        deleteRole,
        getUsersWithRoles
    }


}

export default makeRolesDAO;

