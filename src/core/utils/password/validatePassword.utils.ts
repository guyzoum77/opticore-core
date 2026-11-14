import crypto from "crypto";
import {LogMessageUtils} from "../logMessage.utils";
import {HttpStatusCodesConstant as status} from "../../../domain/constants/httpStatusCodes.constant";
import StackTraceError from "../../handlers/errors/base/stackTraceError";
import {ExceptionHandlerError as ErrorHandler} from "../../../index";
import {HashPasswordUtils} from "./hashPassword.utils";

/**
 * It's allow to check if user password is correct with hashed password stored in database.
 *
 * The comparison is constant-time and fails closed: any missing/malformed input or
 * derivation error returns `false` (it never compares `undefined === undefined`).
 */
export class ValidatePasswordUtils {
    /**
     * Verifies a password against a stored PBKDF2 hash.
     *
     * @param password the clear text password to check
     * @param hash the stored hex hash
     * @param salt the stored salt
     * @param iterations the iteration count stored with the hash. When omitted, the current
     *                   default (`HashPasswordUtils.DEFAULT_ITERATIONS`) and the legacy count
     *                   (`HashPasswordUtils.LEGACY_ITERATIONS`, hashes made by older versions) are tried.
     */
    static verifyHash (password: string, hash: any, salt: any, iterations?: number): boolean {
        try {
            if (typeof password !== "string" || password.length === 0) return false;
            if (typeof hash !== "string" || !/^[0-9a-f]+$/i.test(hash)) return false;
            if (typeof salt !== "string" || salt.length === 0) return false;

            const expected: Buffer = Buffer.from(hash, "hex");
            if (expected.length !== HashPasswordUtils.KEY_LENGTH) return false;

            const candidates: number[] = iterations !== undefined
                ? [iterations]
                : [HashPasswordUtils.DEFAULT_ITERATIONS, HashPasswordUtils.LEGACY_ITERATIONS];

            let match: boolean = false;
            for (const rounds of candidates) {
                if (!Number.isSafeInteger(rounds) || rounds < 1) return false;
                const derived: Buffer = crypto.pbkdf2Sync(
                    password, salt, rounds, HashPasswordUtils.KEY_LENGTH, HashPasswordUtils.DIGEST
                );
                match = crypto.timingSafeEqual(derived, expected) || match;
            }
            return match;
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
            return false;
        }
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}
