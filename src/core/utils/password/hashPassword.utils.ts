import crypto from "crypto";
import {LoggerComponent} from "../../../presentation/components/logger.component";


/**
 * A class that allow to hash user password.
 */
export class HashPasswordUtils {
    static password (password: string) {
        let salt: any, genHash: any;

        try {
            salt = crypto.randomBytes(32).toString('hex');
            genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        } catch (err: any) {
            LoggerComponent.logErrorMessage(err.message, "Hash Password")
        }

        return {
            salt: salt,
            hash: genHash,
        };
    }
}