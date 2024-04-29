import crypto from "crypto";
import {LoggerComponent} from "../../../presentation/components/logger.component";

/**
 * It's allow to check if user password is correct with hashed password stored in database.
 */
export class ValidatePasswordUtils {
    static verifyHash (password: string, hash: any, salt: any): boolean {
        let hashVerify: any;

        try {
            hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        } catch (err: any) {
            LoggerComponent.logErrorMessage(err.message, "app");
        }

        return hash === hashVerify;
    }
}