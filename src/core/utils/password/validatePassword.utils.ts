import crypto from "crypto";
import {LogMessageUtils} from "../logMessage.utils";
import {HttpStatusCodesConstant as status} from "../../../domain/constants/httpStatusCodes.constant";

/**
 * It's allow to check if user password is correct with hashed password stored in database.
 */
export class ValidatePasswordUtils {
    static verifyHash (password: string, hash: any, salt: any): boolean {
        let hashVerify: any;

        try {
            hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        } catch (err: any) {
            LogMessageUtils.error(
                "Validate Password",
                "",
                "",
                "",
                "",
                "",
                status.NOT_ACCEPTABLE
            );
        }

        return hash === hashVerify;
    }
}