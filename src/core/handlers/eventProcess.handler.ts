import {eventName, event, express} from "../../index";
import {ServerListenEventError} from "../../errors/serverListen.event.error";

export function eventProcessHandler() {
    // Listener for error events
    this.errorEmitter.on(eventName.error, (error: Error): void => {
        ServerListenEventError.listenerError(error);
    });

    // Catch uncaught exceptions
    /**
     *  Process event listeners
     */
    process.on(event.beforeExit, (code: number): void => {
        setTimeout((): void => {
            ServerListenEventError.processBeforeExit(code);
        }, 100);
    });
    process.on(event.disconnect, (): void => {
        ServerListenEventError.processDisconnected();
    });
    process.on(event.exit, (code: number): void => {
        ServerListenEventError.exited(code);
    });
    process.on(event.rejectionHandled, (promise: Promise<any>): void => {
        ServerListenEventError.promiseRejectionHandled(promise);
    });
    process.on(event.uncaughtException, (error: any): void => {
        ServerListenEventError.uncaughtException(error);
    });
    process.on(event.uncaughtExceptionMonitor, (error: any): void => {
        ServerListenEventError.uncaughtExceptionMonitor(error);
    });
    process.on(event.unhandledRejection, (reason: any, promise: Promise<any>): void => {
        ServerListenEventError.unhandledRejection(reason, promise);
    });
    process.on(event.warning, (warning: any) => {
        ServerListenEventError.warning(warning);
    });
    process.on(event.message, (message: any) => {
        ServerListenEventError.message(message);
    });
    process.on(event.multipleResolves, (type: string, promise: Promise<any>, reason: any) => {
        ServerListenEventError.multipleResolves(type, promise, reason);
    });
    // Handle specific signals
    process.on(event.sigint, () => {
        ServerListenEventError.processInterrupted();
    });
    process.on(event.sigterm, (signal) => {
        ServerListenEventError.sigtermSignalReceived(signal);
    });
    // Express error-handling middleware
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        ServerListenEventError.expressErrorHandlingMiddleware(this.errorEmitter, err, req, res, next);
    });
}