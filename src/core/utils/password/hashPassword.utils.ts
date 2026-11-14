import crypto from "crypto";
import {LogMessageUtils} from "../logMessage.utils";
import {ExceptionHandlerError as ErrorHandler, HttpStatusCodesConstant as status} from "../../../index";
import StackTraceError from "../../handlers/errors/base/stackTraceError";


/**
 * A class that allow to hash user password.
 *
 * Passwords are derived with PBKDF2-HMAC-SHA512, a 32-byte random salt and
 * `HashPasswordUtils.DEFAULT_ITERATIONS` iterations (OWASP recommendation for
 * PBKDF2-HMAC-SHA512). Hashes created by older versions used
 * `HashPasswordUtils.LEGACY_ITERATIONS` (10 000) iterations; `ValidatePasswordUtils.verifyHash`
 * still accepts them so existing stored hashes keep working.
 */
export class HashPasswordUtils {
    static readonly DEFAULT_ITERATIONS: number = 210_000;
    static readonly LEGACY_ITERATIONS: number = 10_000;
    static readonly KEY_LENGTH: number = 64;
    static readonly DIGEST: string = "sha512";

    /**
     * Hashes a password.
     *
     * @param password the clear text password (non-empty string)
     * @param iterations PBKDF2 iterations, defaults to `DEFAULT_ITERATIONS`; values below
     *                   `LEGACY_ITERATIONS` are refused.
     * @returns the hex salt, the hex hash and the iteration count to store with them
     *          (pass it back to `ValidatePasswordUtils.verifyHash`).
     */
    static password (password: string, iterations: number = HashPasswordUtils.DEFAULT_ITERATIONS) {
        let salt: any, genHash: any;

        try {
            if (typeof password !== "string" || password.length === 0) {
                throw new TypeError("The password must be a non-empty string");
            }
            if (!Number.isSafeInteger(iterations) || iterations < HashPasswordUtils.LEGACY_ITERATIONS) {
                throw new RangeError(`PBKDF2 iterations must be an integer >= ${HashPasswordUtils.LEGACY_ITERATIONS}`);
            }
            salt = crypto.randomBytes(32).toString('hex');
            genHash = crypto.pbkdf2Sync(
                password, salt, iterations, HashPasswordUtils.KEY_LENGTH, HashPasswordUtils.DIGEST
            ).toString('hex');
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
            throw new Error(err.message);
        }

        return {
            salt: salt,
            hash: genHash,
            iterations: iterations,
        };
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}
