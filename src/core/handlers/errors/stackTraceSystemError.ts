import StackTraceError from "./base/stackTraceError";
import {errorNameConstant} from "../../utils/constants/errorName.constant";
import {HttpStatusCodesConstant as status} from "../../../domain/constants/httpStatusCodes.constant";


/**
 * Handling and catch a Node.js error.
 */
export default class StackTraceSystemError extends StackTraceError {
    constructor(message: string, code: string) {
        super(message, errorNameConstant.systemError, status.INTERNAL_SERVER_ERROR, false);
        this.message = `${message} (code: ${code})`;
    }
}