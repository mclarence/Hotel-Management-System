import {IDatabase} from "pg-promise";

export interface ITokenRevocationListDAO {
    revokeToken: (token: String) => Promise<void>,
    checkTokenRevoked: (token: String) => Promise<boolean>
}

const makeTokenRevocationListDAO = (db: IDatabase<any, any>): ITokenRevocationListDAO => {
    const revokeToken = (token: String): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const now = new Date();
            db.none(`
            INSERT INTO token_revocation_list (token, revokedAt) VALUES ($1, $2)
        `, [token, now]).then(() => {
                resolve();
            }).catch((err: any) => {
                reject(err);
            })
        })
    }

    const checkTokenRevoked = (token: String): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            db.oneOrNone(`
            SELECT * FROM token_revocation_list WHERE token = $1
        `, [token]).then((tokenRevocationList: any) => {
                if (tokenRevocationList === null) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch((err: any) => {
                reject(err);
            })
        })
    }

    return {
        revokeToken,
        checkTokenRevoked
    }
}

export default makeTokenRevocationListDAO;