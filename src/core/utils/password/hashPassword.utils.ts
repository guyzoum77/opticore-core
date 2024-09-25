import crypto from "crypto";
import {LogMessageUtils} from "../logMessage.utils";
import {ExceptionHandlerError as ErrorHandler, HttpStatusCodesConstant as status} from "../../../index";
import StackTraceError from "../../handlers/errors/base/stackTraceError";


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
            const stackTrace: StackTraceError = this.traceError(
                err.message,
                "hash error",
                status.NOT_ACCEPTABLE
            );
            LogMessageUtils.error(
                "Hash Password",
                "hash error",
                stackTrace.stack,
                err.message,
                status.NOT_ACCEPTABLE
            );
            throw new Error()
        }

        return {
            salt: salt,
            hash: genHash,
        };
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}