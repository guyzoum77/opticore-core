import crypto from "crypto";
import {LogMessageUtils} from "../logMessage.utils";
import {Exception as msg, HttpStatusCodesConstant as status} from "../../../index";


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
            LogMessageUtils.error(
                "Hash Password",
                "",
                "",
                "",
                "",
                "",
                status.NOT_ACCEPTABLE
            );
        }

        return {
            salt: salt,
            hash: genHash,
        };
    }
}