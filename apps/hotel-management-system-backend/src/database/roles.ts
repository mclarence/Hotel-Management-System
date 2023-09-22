import {db} from "./db";
import {Role} from "@hotel-management-system/models";
import pgPromise from "pg-promise";
import queryResultErrorCode = pgPromise.errors.queryResultErrorCode;
import QueryResultError = pgPromise.errors.QueryResultError;
export const getRoleById = (roleId: number): Promise<Role | null> => {
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