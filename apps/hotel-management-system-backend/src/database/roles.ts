import {Role, User} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queries from "./sql/queries";
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
import QueryResultError = pgPromise.errors.QueryResultError;

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
            return await db.oneOrNone(queries.roles.getRoleById, [roleId]);
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
        const result: any = await db.one(queries.roles.checkRoleExists, [roleId]);
        return result.exists;
    }

    /**
     * Add role.
     * @param role
     * @returns A promise that resolves to the added role containing the role id.
     */
    const addRole = async (role: Role): Promise<Role> => {
        return await db.one(queries.roles.addRole, [role.name, role.permissionData]);
    }

    /**
     * Update role.
     * @param role
     * @returns A promise that resolves to the updated role.
     */
    const updateRole = async (role: Role): Promise<Role> => {
        return await db.one(queries.roles.updateRole, [role.name, role.permissionData, role.roleId]);
    }

    const getUsersWithRoles = async (roleId: number): Promise<User[]> => {
        try {
            return await db.manyOrNone(queries.roles.getUsersWithRoles, [roleId]);
        } catch (err) {
            if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                return [];
            }
            throw err;
        }
    }

    const deleteRole = async (roleId: number): Promise<void> => {
        await db.none(queries.roles.deleteRole, [roleId]);
    }

    /**
     * Get all roles.
     * @returns A promise that resolves to an array of roles.
     */
    const getAllRoles = async (): Promise<Role[]> => {
        return await db.manyOrNone(queries.roles.getAllRoles);
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

