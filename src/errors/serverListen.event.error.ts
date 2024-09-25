import {LogMessageUtils} from "../core/utils/logMessage.utils";
import {MessagesException as msg} from "../application/exceptions/messages.exception";
import {HttpStatusCodesConstant as status} from "../domain/constants/httpStatusCodes.constant";
import {eventNameErrorConstant as eventName} from "../core/utils/constants/eventNameError.constant";
import {currentDate, ExceptionHandlerError as ErrorHandler} from "../index";
import process from "process";
import colors from "ansi-colors";
import StackTraceError from "../core/handlers/errors/base/stackTraceError";
import express from "express";

export class ServerListenEventError {
    static hostPortUndefined(): void {
        const stackTrace: StackTraceError = this.traceError(msg.errorHostUrl, msg.listening, status.BAD_REQUEST);
        LogMessageUtils.error(
            msg.webServer,
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
            err.stack,
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
            error.stack!,
            error.message,
            status.SERVICE_UNAVAILABLE
        );
    }
    static processBeforeExit(code: number): void {
        const stackTrace: StackTraceError = this.traceError(
            `Process will exit with code: ${code}`,
            "BeforeExit",
            status.SERVICE_UNAVAILABLE
        );
        LogMessageUtils.error(
            "BeforeExit",
            "process before exit",
            stackTrace.stack,
            `Process will exit with code: ${code}`,
            status.SERVICE_UNAVAILABLE
        );
        process.exit(code);
    }
    static processDisconnected(): void {
        const stackTrace: StackTraceError = this.traceError(
            "Child process disconnected",
            "process disconnected",
            status.SERVICE_UNAVAILABLE
        );
        LogMessageUtils.error(
            "Disconnected",
            "process disconnected",
            stackTrace.stack,
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
                const gnleStackTrace: StackTraceError = this.traceError(
                    "Something went wrong",
                    "General Errors",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "General Errors",
                    gnleStackTrace.stack,
                    "Something went wrong",
                    status.SERVICE_UNAVAILABLE
                );
                break
            case 2:
                const incrCmdStackTrace: StackTraceError = this.traceError(
                    "Incorrect using of shell commands",
                    "Misuse of shell builtins",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    incrCmdStackTrace.name,
                    incrCmdStackTrace.stack,
                    "Incorrect using of shell commands",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 126:
                const notExeCmdStackTrace: StackTraceError = this.traceError(
                    "Incorrect using of shell commands",
                    "Misuse of shell builtins",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    `command invoked`,
                    notExeCmdStackTrace.stack,
                    "The command is found but is not executable (e.g., trying to execute a directory)",
                    status.SERVICE_UNAVAILABLE
                );
                break
            case 127:
                const cmdNotFoundStackTrace: StackTraceError = this.traceError(
                    "The command was not found in the system's PATH or is misspelled",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "Command not found",
                    cmdNotFoundStackTrace.stack,
                    "The command was not found in the system's PATH or is misspelled",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 128:
                const cmdSysNotFoundStackTrace: StackTraceError = this.traceError(
                    "The command was not found in the system's PATH or is misspelled",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "Invalid argument",
                    cmdSysNotFoundStackTrace.stack,
                    "The command was not found in the system's PATH or is misspelled",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 130:
                const endScriptStackTrace: StackTraceError = this.traceError(
                    "Indicates that the script was manually terminated by the user using the Control-C (SIGINT) signal",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "Script terminated",
                    endScriptStackTrace.stack,
                    "Indicates that the script was manually terminated by the user using the Control-C (SIGINT) signal",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 137:
                const prcKillStackTrace: StackTraceError = this.traceError(
                    "Indicates that the process was terminated by a SIGKILL signal, possibly due to an out-of-memory situation",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "SIGKILL",
                    prcKillStackTrace.stack,
                    "Indicates that the process was terminated by a SIGKILL signal, possibly due to an out-of-memory situation",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 139:
                const illegalAccessStackTrace: StackTraceError = this.traceError(
                    "Indicates that the process accessed an illegal memory address (segfault)",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "Segmentation fault",
                    illegalAccessStackTrace.stack,
                    "Indicates that the process accessed an illegal memory address (segfault)",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 143:
                const sigtermStackTrace: StackTraceError = this.traceError(
                    "Indicates that the process received a SIGTERM signal to terminate",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "process received a SIGTERM",
                    sigtermStackTrace.stack,
                    "Indicates that the process received a SIGTERM signal to terminate",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            case 255:
                const outsideStackTrace: StackTraceError = this.traceError(
                    "An exit code that is outside the allowable range (0-255 for Unix-like systems)",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "out of range",
                    outsideStackTrace.stack,
                    "An exit code that is outside the allowable range (0-255 for Unix-like systems)",
                    status.SERVICE_UNAVAILABLE
                );
                break;
            default:
                const globalStackTrace: StackTraceError = this.traceError(
                    "Error is occurring",
                    "Exited",
                    status.SERVICE_UNAVAILABLE
                );
                LogMessageUtils.error(
                    "Exited",
                    "errors",
                    globalStackTrace.stack,
                    "Error is occurring",
                    status.SERVICE_UNAVAILABLE
                );
                break;
        }
    }
    static promiseRejectionHandled(promise: Promise<any>): void {
        const globalStackTrace: StackTraceError = this.traceError(
            `Promise rejection is handled at : ${promise}`,
            "rejection promise",
            status.SERVICE_UNAVAILABLE
        );
        LogMessageUtils.error(
            "PromiseRejectionHandled",
            "rejection promise",
            globalStackTrace.stack,
            `Promise rejection is handled at : ${promise}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static uncaughtException(error: any): void {
        if (error.message === '\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.') {
            console.log("");
        } else {
            const tackTrace: StackTraceError = this.traceError(
                error.message,
                "uncaught exception handled",
                status.SERVICE_UNAVAILABLE
            );
            LogMessageUtils.error(
                "UncaughtException",
                "uncaught exception handled",
                tackTrace.stack,
                error.message,
                status.SERVICE_UNAVAILABLE
            );
        }
    }
    static uncaughtExceptionMonitor(error: any): void {
        if (error.message === '\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.') {
            console.log("");
        } else {
            const stackTrace: StackTraceError = this.traceError(
                error.message,
                "uncaught exception handled",
                status.SERVICE_UNAVAILABLE
            );
            LogMessageUtils.error(
                "UncaughtExceptionMonitor",
                "uncaught exception handled",
                stackTrace.stack,
                error.message,
                status.SERVICE_UNAVAILABLE
            );
        }
    }
    static unhandledRejection(reason: any, promise: Promise<any>): void{
        const stackTrace: StackTraceError = this.traceError(
            `Unhandled Rejection at: Promise ${promise} -- reason ${reason}`,
            "Unhandled rejection",
            status.SERVICE_UNAVAILABLE
        );
        LogMessageUtils.error(
            "UnhandledRejection",
            "Unhandled rejection",
            stackTrace.stack,
            `Unhandled Rejection at: Promise ${promise} -- reason ${reason}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static warning(warning: any): void {
        const stackTrace: StackTraceError = this.traceError(warning.message, "warning", status.SERVICE_UNAVAILABLE);
        LogMessageUtils.error(
            "Warning",
            "warning",
            stackTrace.stack,
            warning.message,
            status.SERVICE_UNAVAILABLE
        );
    }
    static message(message: any): void {
        const stackTrace: StackTraceError = this.traceError(
            `process got message ${message}`,
            "message exception",
            status.SERVICE_UNAVAILABLE
        );
        LogMessageUtils.error(
            "Message",
            "message exception",
            stackTrace.stack,
            `process got message ${message}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static multipleResolves(type: string, promise: Promise<any>, reason: any): void {
        const stackTrace: StackTraceError = this.traceError(
            `${promise} -- ${reason}`,
            "multipleResolves",
            status.SERVICE_UNAVAILABLE
        );
        LogMessageUtils.error(
            "multipleResolves",
            `Multiple resolves detected : ${type}`,
            stackTrace.stack,
            `${promise} -- ${reason}`,
            status.SERVICE_UNAVAILABLE
        );
    }
    static processInterrupted(): void {
        const stackTrace: StackTraceError = this.traceError(
            `Process ${process.pid} has been interrupted`,
            "SIGINT",
            status.NOT_ACCEPTABLE
        );
        LogMessageUtils.error(
            "SIGINT",
            "SIGINT",
            stackTrace.stack,
            `Process ${process.pid} has been interrupted`,
            status.NOT_ACCEPTABLE
        );
        process.exit(0);
    }
    static sigtermSignalReceived(signal: any): void {
        const stackTrace: StackTraceError = this.traceError(
            `Process ${process.pid} received a SIGTERM signal`,
            "SIGTERM",
            status.NOT_ACCEPTABLE
        );
        LogMessageUtils.error(
            "SIGTERM",
            "SIGTERM",
            stackTrace.stack,
            `Process ${process.pid} received a SIGTERM signal : ${signal.toString()}`,
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
        console.log(`${colors.cyan(`ⓘ`)} ${colors.bgCyan(` ${colors.bold(`${colors.white(` Server maxConnection `)}`)} `)}  ${currentDate} | ${colors.bgCyan(`${colors.white(` Info `)}`)} The server dropped new connections`);
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
            const stackTrace: StackTraceError = this.traceError(
                err.message,
                "Express error",
                status.NOT_ACCEPTABLE
            );
            LogMessageUtils.error(
                "Express error-handling middleware",
                "Express error",
                stackTrace.stack,
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