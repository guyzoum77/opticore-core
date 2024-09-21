import {LogMessageUtils} from "../core/utils/logMessage.utils";
import {MessagesException as msg} from "../application/exceptions/messages.exception";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {eventNameErrorConstant as eventName} from "../core/utils/constants/eventNameError.constant";
import {express} from "../index";

export class ServerListenEventError {
    static hostPortUndefined(){
        LogMessageUtils.error(msg.webServer, msg.listening, msg.webHost, msg.badHost, msg.hostNotFound, msg.errorHostUrl, status.BAD_REQUEST);
        process.exit();
    }
    static hostUndefined() {
        LogMessageUtils.error(msg.webServer, msg.listening, msg.webHost, msg.badHost, msg.hostNotFound, msg.errorHost, status.BAD_REQUEST);
        process.exit();
    }
    static portUndefined() {
        LogMessageUtils.error(msg.webServer, msg.listening, msg.webHost, msg.badPort, msg.badPort, msg.errorPort, status.BAD_REQUEST);
        process.exit();
    }
    static onEventError(err: Error) {
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
    static listenerError(error: Error) {
        LogMessageUtils.error(
            "Event error",
            "Error",
            "Stack trace error",
            error,
            "error",
            error,
            status.SERVICE_UNAVAILABLE
        );
    }
    static processBeforeExit(code: number) {
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
    static processDisconnected() {
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
    static promiseRejectionHandled(promise: Promise<any>){
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
    static uncaughtException(error: any) {
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
    static uncaughtExceptionMonitor(error: any){
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
    static warning(warning: any){
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
    static message(message: any) {
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
    static multipleResolves(type: string, promise: Promise<any>, reason: any){
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
    static processInterrupted(){
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
    static sigtermSignalReceived(signal){
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
    static expressErrorHandlingMiddleware(errorEmitter, err: Error, req: express.Request, res: express.Response, next: express.NextFunction){
        if (err) {
            errorEmitter.emit(eventName.error, err);
            res.status(500).send('An internal server error occurred');
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
}