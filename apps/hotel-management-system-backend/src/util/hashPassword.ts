import crypto from "crypto";

/**
 * Hashes the password with the salt
 * @param password - password to hash
 * @param salt - salt to hash with
 */
const hashPassword = (password: string, salt: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

export default hashPassword