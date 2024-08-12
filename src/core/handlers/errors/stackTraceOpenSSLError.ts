import StackTraceError from "./base/stackTraceError";
import {errorNameConstant} from "../../utils/constants/errorName.constant";
import {HttpStatusCodesConstant as status} from "../../../domain/constants/httpStatusCodes.constant";

/**
 * Handling and catch a Node.js error.
 */
export default class StackTraceOpenSSLError extends StackTraceError {
    constructor(message: string) {
        super(message, errorNameConstant.evalError, status.INTERNAL_SERVER_ERROR, false);
    }
}