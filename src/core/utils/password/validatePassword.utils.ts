import crypto from "crypto";
import {LogMessageUtils} from "../logMessage.utils";
import {HttpStatusCodesConstant as status} from "../../../domain/constants/httpStatusCodes.constant";
import StackTraceError from "../../handlers/errors/base/stackTraceError";
import {ExceptionHandlerError as ErrorHandler} from "../../../index";

/**
 * It's allow to check if user password is correct with hashed password stored in database.
 */
export class ValidatePasswordUtils {
    static verifyHash (password: string, hash: any, salt: any): boolean {
        let hashVerify: any;

        try {
            hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        } catch (err: any) {
            const stackTrace: StackTraceError = this.traceError(
                err.message,
                "error validation",
                status.NOT_ACCEPTABLE
            );
            LogMessageUtils.error(
                "Validate Password error",
                "error validation",
                stackTrace.stack,
                err.message,
                status.NOT_ACCEPTABLE
            );
        }

        return hash === hashVerify;
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}