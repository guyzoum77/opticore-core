import {LogMessageUtils} from "../core/utils/logMessage.utils";
import {MessagesException as msg} from "../application/exceptions/messages.exception";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {eventNameErrorConstant as eventName} from "../core/utils/constants/eventNameError.constant";
import {dateTimeFormattedUtils, ExceptionHandlerError as ErrorHandler, express} from "../index";
import process from "process";
import colors from "ansi-colors";
import StackTraceError from "../core/handlers/errors/base/stackTraceError";

export class ServerListenEventError {
    static hostPortUndefined(): void {
        const stackTrace: StackTraceError = this.traceError(msg.errorHostUrl, msg.listening, status.BAD_REQUEST);
        LogMessageUtils.error(
            msg.webServer,
            msg.listening,
            msg.webHost,
            msg.badHost,
            stackTrace.stack!,
            msg.errorHostUrl,
            status.BAD_REQUEST
        );
        process.exit();
    }
    static hostUndefined(): void {
        const stackTrace: StackTraceError = this.traceError(msg.badHost, msg.listening, status.BAD_REQUEST);
        LogMessageUtils.error(
            msg.webServer,
            msg.listening,
            msg.webHost,
            msg.badHost,
            stackTrace.stack!,
            msg.errorHost,
            status.BAD_REQUEST
        );
        process.exit();
    }
    static portUndefined(): void {
        const stackTrace: StackTraceError = this.traceError(msg.badPort, msg.listening, status.BAD_REQUEST);
        LogMessageUtils.error(
            msg.webServer,
            msg.listening,
            msg.webHost,
            msg.badPort,
            stackTrace.stack!,
            msg.errorPort,
            status.BAD_REQUEST
        );
        process.exit();
    }
    static onEventError(err: Error): void {
        LogMessageUtils.error(
            "Server start error",
            "Error",
            "Stack trace error",
            err.stack,
            err.name,
            err.message,
            status.SERVICE_UNAVAILABLE
        );
    }
    static listenerError(error: Error): void {
        const stackTrace: StackTraceError = this.traceError(
            error.message,
            error.name,
            status.BAD_REQUEST
        );
        LogMessageUtils.error(
            "Event error",
            "Error",
            "",
            "",
            error.stack!,
            error.message,
            status.SERVICE_UNAVAILABLE
        );
    }
    static processBeforeExit(code: number): void {
        LogMessageUtils.error(
            "BeforeExit",
            "process before exit",
            `exit code: ${code}`,
            "before exit",
            "exit with code",
            `Process will exit with code: ${code}`,
            status.SERVICE_UNAVAILABLE
        );
        process.exit(code);
    }
    static processDisconnected(): void {
        LogMessageUtils.error(
            "Disconnected",
            "process disconnected",
            `disconnected`,
            "child process",
            "process disconnected",
            "Child process disconnected",
            status.SERVICE_UNAVAILABLE
        );
        process.exit();
    }
    static exited(code: number){
        switch (code) {
            case 0:
                LogMessageUtils.success(
                    "Exited",
                    "completed",
                    "The process finished as expected and everything worked correctly"
                );
                break;
            case 1:
                LogMessageUtils.error(
                    "Exited",
                    "General Errors",
                    `errors`,
                    "exit",
                    "exit with code",
                    "Something went wrong",
                    status.SERVICE_UNAVAILABLE
                );
                break
            case 2:
                LogMessageUtils.error(
                    "Exited",
                    "Misuse of shell builtins",
                    `Misuse`,
                    "Incorrect use",
                    "shell commands",
                    "Incorrect using of shell commands",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 126:
                LogMessageUtils.error(
                    "Exited",
                    "Command invoked cannot execute",
                    `command invoked`,
                    "invoked",
                    "not executable",
                    "The command is found but is not executable (e.g., trying to execute a directory)",
                    status.SERVICE_UNAVAILABLE
                );
                break
            case 127:
                LogMessageUtils.error(
                    "Exited",
                    "Command not found",
                    `command not found`,
                    "not found",
                    "not found",
                    "The command was not found in the system's PATH or is misspelled",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 128:
                LogMessageUtils.error(
                    "Exited",
                    "Invalid argument to exit",
                    "Invalid argument",
                    "argument to exit",
                    "invalid argument",
                    "The command was not found in the system's PATH or is misspelled",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 130:
                LogMessageUtils.error(
                    "Exited",
                    "Script terminated by Control-C",
                    "Script terminated",
                    "terminated",
                    "terminated by Control-C",
                    "Indicates that the script was manually terminated by the user using the Control-C (SIGINT) signal",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 137:
                LogMessageUtils.error(
                    "Exited",
                    "Termination by SIGKILL (or out of memory)",
                    "termination",
                    "SIGKILL",
                    "termination by SIGKILL",
                    "Indicates that the process was terminated by a SIGKILL signal, possibly due to an out-of-memory situation",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 139:
                LogMessageUtils.error(
                    "Exited",
                    "Segmentation fault",
                    "Segmentation",
                    "illegal memory address",
                    "process accessed",
                    "Indicates that the process accessed an illegal memory address (segfault)",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 143:
                LogMessageUtils.error(
                    "Exited",
                    "termination by SIGTERM",
                    "termination",
                    "fault",
                    "process received a SIGTERM",
                    "Indicates that the process received a SIGTERM signal to terminate",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 255:
                LogMessageUtils.error(
                    "Exited",
                    "exit status out of range",
                    "out of range",
                    "status out",
                    "exit status out",
                    "Indicates an exit code that is outside the allowable range (0-255 for Unix-like systems)",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            default:
                LogMessageUtils.error(
                    "Exited",
                    "Errors",
                    `errors`,
                    "exit",
                    "exit with code",
                    "Error is occurring",
                    status.SERVICE_UNAVAILABLE
                );
                break;
        }
    }
    static promiseRejectionHandled(promise: Promise<any>): void {
        LogMessageUtils.error(
            "PromiseRejectionHandled",
            "rejection promise",
            "rejection",
            "RejectionHandled",
            "promise",
            `Promise rejection is handled at : ${promise}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static uncaughtException(error: any): void {
        if (error.message === '\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.') {
            console.log("");
        } else {
            LogMessageUtils.error(
                "UncaughtException",
                "uncaught exception handled",
                "exception",
                error.stack,
                error.name,
                error.message,
                status.SERVICE_UNAVAILABLE
            );
        }
    }
    static uncaughtExceptionMonitor(error: any): void {
        if (error.message === '\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.') {
            console.log("");
        } else {
            LogMessageUtils.error(
                "UncaughtExceptionMonitor",
                "uncaught exception handled",
                "exception",
                error.stack,
                error.name,
                error.message,
                status.SERVICE_UNAVAILABLE
            );
        }
    }
    static unhandledRejection(reason: any, promise: Promise<any>){
        LogMessageUtils.error(
            "UnhandledRejection",
            "Unhandled rejection",
            "exception",
            "unhandledRejection",
            "unhandledRejection",
            `Unhandled Rejection at: Promise ${promise} -- reason ${reason}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static warning(warning: any): void {
        LogMessageUtils.error(
            "Warning",
            "warning",
            "warning",
            warning.stack,
            warning.name,
            warning.message,
            status.SERVICE_UNAVAILABLE
        );
    }
    static message(message: any): void {
        LogMessageUtils.error(
            "Message",
            "message exception",
            "message",
            "Process message received",
            "message received",
            `process got message ${message}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static multipleResolves(type: string, promise: Promise<any>, reason: any): void {
        LogMessageUtils.error(
            "multipleResolves",
            "resolves",
            "resolves detected",
            "detection",
            `Multiple resolves detected : ${type}`,
            `${promise} -- ${reason}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static processInterrupted(): void {
        LogMessageUtils.error(
            "SIGINT",
            "SIGINT",
            "SIGINT",
            "received",
            "SIGINT",
            `Process ${process.pid} has been interrupted`,
            status.NOT_ACCEPTABLE
        );
        process.exit(0);
    }
    static sigtermSignalReceived(signal: any): void {
        LogMessageUtils.error(
            "SIGTERM",
            "SIGTERM",
            "SIGTERM",
            "received",
            signal,
            `Process ${process.pid} received a SIGTERM signal`,
            status.NOT_ACCEPTABLE
        );
        process.exit(0);
    }
    static serverClosing(): void {
        console.log(`${colors.bgCyanBright(` ${colors.bold(`${colors.white(` INFO `)}`)}`)} All processes are stopped`);
        console.log("       Server is closed");
        process.exit();
    }
    static dropNewConnection(): void {
        console.log(`${colors.cyan(`ⓘ`)} ${colors.bgCyan(` ${colors.bold(`${colors.white(` Server maxConnection `)}`)} `)}  ${dateTimeFormattedUtils} | ${colors.bgCyan(`${colors.white(` Info `)}`)} The server dropped new connections`);
    }
    static expressErrorHandlingMiddleware(errorEmitter: any,
                                          err: Error,
                                          req: express.Request,
                                          res: express.Response,
                                          next: express.NextFunction): void {
        if (err) {
            errorEmitter.emit(eventName.error, err);
            if (typeof res.status === 'function') {
                res.status(500).send('Internal Server Error');
            } else {
                console.error('res.status is not a function');
            }
            LogMessageUtils.error(
                "Express error-handling middleware",
                "Express error",
                "Stack trace error",
                err.stack,
                err.name,
                err.message,
                status.SERVICE_UNAVAILABLE
            )
        } else {
            next();
        }
    }

    private static traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}