import express, {Express} from "express";
import process from 'node:process';
import EventEmitter from "node:events";
import {eventName, event} from "../../index";
import {ServerListenEventError} from "@/errors/serverListen.event.error";

/**
 *
 */
export function eventProcessHandler(): void {
    const errorEmitter = new EventEmitter();
    const app: Express = express();

    /**
     * Listener for error events
     */
    errorEmitter.on(eventName.error, (error: Error): void => {
        ServerListenEventError.listenerError(error);
    });

    /**
     * Catch uncaught exceptions
     * Process event listeners
     */
    process.on(event.beforeExit, (code: number): void => {
        setTimeout((): void => {
            ServerListenEventError.processBeforeExit(code);
        }, 100);
    });

    /**
     *
     */
    process.on(event.disconnect, (): void => {
        ServerListenEventError.processDisconnected();
    });

    /**
     *
     */
    process.on(event.exit, (code: number): void => {
        ServerListenEventError.exited(code);
    });

    /**
     *
     */
    process.on(event.rejectionHandled, (promise: Promise<any>): void => {
        ServerListenEventError.promiseRejectionHandled(promise);
    });

    /**
     *
     */
    process.on(event.uncaughtException, (error: any): void => {
        ServerListenEventError.uncaughtException(error);
    });

    /**
     *
     */
    process.on(event.uncaughtExceptionMonitor, (error: any): void => {
        ServerListenEventError.uncaughtExceptionMonitor(error);
    });

    /**
     *
     */
    process.on(event.unhandledRejection, (reason: any, promise: Promise<any>): void => {
        ServerListenEventError.unhandledRejection(reason, promise);
    });

    /**
     *
     */
    process.on(event.warning, (warning: any): void => {
        ServerListenEventError.warning(warning);
    });
    process.on(event.message, (message: any): void => {
        ServerListenEventError.message(message);
    });

    /**
     *
     */
    process.on(event.multipleResolves, (type: string, promise: Promise<any>, reason: any): void => {
        ServerListenEventError.multipleResolves(type, promise, reason);
    });

    /**
     * Handle specific signals
     */
    process.on(event.sigint, (): void => {
        ServerListenEventError.processInterrupted();
    });
    process.on(event.sigterm, (signal: any): void => {
        ServerListenEventError.sigtermSignalReceived(signal);
    });

    /**
     * Express error-handling middleware
     */
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
        ServerListenEventError.expressErrorHandlingMiddleware(errorEmitter, err, req, res, next);
    });
}