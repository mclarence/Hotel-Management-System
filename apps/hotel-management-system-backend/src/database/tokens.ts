import {IDatabase} from "pg-promise";
import queries from "./sql/queries";

export interface ITokenRevocationListDAO {
    revokeToken: (token: string) => Promise<void>,
    checkTokenRevoked: (token: string) => Promise<boolean>
}

const makeTokenRevocationListDAO = (db: IDatabase<any, any>): ITokenRevocationListDAO => {

    /**
     * Revoke token
     * @param token
     * @returns - void
     */
    const revokeToken = async (token: string): Promise<void> => {
        const now = new Date();
        await db.none(queries.tokenRevocationList.revokeToken, [token, now]);
    }

    /**
     * Check if token is revoked
     * @param token
     * @returns - boolean
     */
    const checkTokenRevoked = async (token: string): Promise<boolean> => {
        const tokenRevocationList: any = await db.oneOrNone(queries.tokenRevocationList.checkTokenRevoked, [token]);
        return tokenRevocationList !== null;

    }

    return {
        revokeToken,
        checkTokenRevoked
    }
}

export default makeTokenRevocationListDAO;