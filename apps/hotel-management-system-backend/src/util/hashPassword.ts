import crypto from "crypto";

const hashPassword = (password: string, salt: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

export default hashPassword