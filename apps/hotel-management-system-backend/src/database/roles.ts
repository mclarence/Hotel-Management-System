import {Role} from "@hotel-management-system/models";
import pgPromise, {IDatabase} from "pg-promise";
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
import QueryResultError = pgPromise.errors.QueryResultError;

export interface IRolesDAO {
    getRoleById: (roleId: number) => Promise<Role | null>,
    checkRoleExists: (roleId: number) => Promise<boolean>,
    addRole: (role: Role) => Promise<Role>,
    updateRole: (role: Role) => Promise<Role>
}

export const makeRolesDAO = (db: IDatabase<any, any>): IRolesDAO => {
    const getRoleById = (roleId: number): Promise<Role | null> => {
        return new Promise<Role | null>((resolve, reject) => {
            db.oneOrNone(`
            SELECT * FROM roles WHERE role_id = $1
        `, [roleId]).then((role: Role) => {
                resolve(role);
            }).catch((err: any) => {
                if (err instanceof QueryResultError && err.code === queryResultErrorCode.noData) {
                    resolve(null);
                } else {
                    reject(err);
                }
            })
        })
    }

    const checkRoleExists = (roleId: number): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            db.one(`
                SELECT EXISTS(SELECT 1 FROM roles WHERE role_id = $1)
            `, [roleId]).then((result: any) => {
                resolve(result.exists);
            }).catch((err: any) => {
                reject(err);
            })
        })
    }

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

    const updateRole = (role: Role): Promise<Role> => {
        return new Promise<Role>((resolve, reject) => {
            checkRoleExists(role.roleId).then((exists: boolean) => {
                if (!exists) {
                    reject(new Error(`Role with id ${role.roleId} does not exist`));
                }
            })
                .then(() => {
                    db.one(`
                        UPDATE roles
                        SET name = $1, permission_data = $2
                        WHERE role_id = $3
                        RETURNING *
                    `, [role.name, role.permissionData, role.roleId]).then((role: Role) => {
                        resolve(role);
                    }).catch((err: any) => {
                        reject(err);
                    })
                })
        })
    }

    return {
        getRoleById,
        checkRoleExists,
        addRole,
        updateRole
    }
}

export default makeRolesDAO;

