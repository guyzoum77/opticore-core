import "reflect-metadata";
import {IncomingMessage, ServerResponse, Server as serverWebApp} from "node:http";
import corsOrigin, {CorsOptions} from "cors";
import express from "express";
import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    ExceptionHandlerError as ErrorHandler,
    getEnvVariable,
    requestCallsEvent,
    UtilityUtils,
    currentDate, IRouteDefinition, HttpStatusCodesConstant as status, LogMessageUtils
} from "../index";
import StackTraceError from "./handlers/errors/base/stackTraceError";
import {coreListenerEventLoaderModuleService} from "@/application/services/coreListenerEvent.service";
import {KernelModuleType} from "./types/kernelModule.type";



export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    private expressApp = express();
    private readonly routerExpressApp: express.Application;
    private readonly port: number;
    private readonly host: string;

    constructor(app: express.Application, corsOriginOptions?: Partial<CorsOptions>) {
        this.port = Number(getEnvVariable.appPort);
        this.host = getEnvVariable.appHost;
        this.routerExpressApp = app;

        // Do not advertise the framework (fingerprinting).
        this.expressApp.disable("x-powered-by");
        this.expressApp.use(express.json());
        this.expressApp.use(express.raw());
        this.expressApp.use(express.text());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(corsOrigin(corsOriginOptions));

        this.stackTraceErrorHandling();
    }

    public onStartServer(routers: { featureRoute: IRouteDefinition[] }[]) {
        return this.expressApp.listen(
            this.port,
            this.host,
            (error?: Error): void => {
                // Express 5 also calls this callback with the error when the server cannot listen (EADDRINUSE...):
                // the error is reported by the server's "error" listener, no route is registered.
                if (error) {
                    return;
                }
                try {
                    if (this.host === "" && this.port === 0) {
                        eventErrorOnListeningServer.hostPortUndefined();
                    } else if (this.host === "") {
                        eventErrorOnListeningServer.hostUndefined();
                    } else if (this.port === 0) {
                        eventErrorOnListeningServer.portUndefined();
                    } else {
                       this.registerRoutes(routers);
                    }
                } catch (err: any) {
                    const stackTrace: StackTraceError = this.traceError(err.message, "Error", status.NOT_ACCEPTABLE);
                    LogMessageUtils.error("Routes registration", "Error", stackTrace.stack, err.message, status.NOT_ACCEPTABLE);
                }
            }
        );
    }

    public onListeningOnServerEvent(serverWeb: serverWebApp, kernelModule: KernelModuleType): void {
        serverWeb.on(eventName.error, (err: Error): void => {
            eventErrorOnListeningServer.onEventError(err);
        }).on(eventName.close, (): void => {
            eventErrorOnListeningServer.serverClosing();
        }).on(eventName.drop, (): void => {
            eventErrorOnListeningServer.dropNewConnection();
        }).on(eventName.listening, (): void => {
            this.infoWebApp();
            coreListenerEventLoaderModuleService(kernelModule);
        });
    }

    public onRequestOnServerEvent(serverWeb: serverWebApp): void {
        serverWeb.on(eventName.request, (req: IncomingMessage, res: ServerResponse): void => {
            requestCallsEvent(req, res, this.host, this.port, currentDate);
        });
    }

    public kernelModules(registerRouter: { featureRoute: IRouteDefinition[] }[], dbConnection: () => void): KernelModuleType {
       return [registerRouter, dbConnection] as KernelModuleType
    }

    /**
     * Mounts every feature router on its path, then the last-resort error handler.
     * Paths follow Express 5 (path-to-regexp 8) syntax: a legacy pattern such as `*`, `/:id?` or `/(.*)` is
     * refused with an error naming the route and the Express 5 equivalent (`/*splat`, `{/:id}`).
     */
    private registerRoutes(allFeatureRoutes: { featureRoute: IRouteDefinition[] }[]) {
        allFeatureRoutes.forEach((router) => {
            router.featureRoute.forEach((route) => {
                try {
                    this.expressApp.use(route.path, route.handler);
                } catch (error: any) {
                    throw new TypeError(
                        `Invalid route path "${String(route.path)}" for Express 5: ${error?.message}. ` +
                        `Use "/*splat" instead of "*", "{/:param}" instead of "/:param?", and no inline regular expressions.`
                    );
                }
            });
        });
        this.expressApp.use(CoreApplication.errorHandler);
    }

    /**
     * Last-resort error handler, registered after the feature routes.
     * Express' default handler prints the stack trace in the response whenever NODE_ENV is not
     * "production" (including when it is unset); this one never returns stacks or internal
     * messages, except for client errors (4xx) raised by body parsers, and only logs the details.
     */
    private static errorHandler(err: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (res.headersSent) {
            next(err);
            return;
        }
        const httpStatus: number = Number(err?.status ?? err?.statusCode);
        const isClientError: boolean = Number.isInteger(httpStatus) && httpStatus >= 400 && httpStatus < 500;
        const responseStatus: number = isClientError ? httpStatus : status.INTERNAL_SERVER_ERROR;
        if (!isClientError) {
            console.error(`[CoreApplication] ${req.method} ${req.originalUrl} failed:`, err);
        }
        res.status(responseStatus).json({
            errorMessage: isClientError && err?.expose !== false ? String(err?.message ?? "Bad Request") : "Internal Server Error",
            responseStatus: responseStatus
        });
    }
    private stackTraceErrorHandling(): void {
        eventProcessHandler();
    }
    private infoWebApp(): void {
        this.serverUtility.infoServer(
            this.serverUtility.getVersions().nodeVersion,
            this.serverUtility.getProjectInfo().startingTime,
            getEnvVariable.appHost,
            Number(getEnvVariable.appPort),
            this.serverUtility.getUsageMemory().rss,
            this.serverUtility.getUsageMemory().heapUsed,
            this.serverUtility.getUsageMemory().user,
            this.serverUtility.getUsageMemory().system
        );
    }
    private traceError(props: string, name: string, status: number): StackTraceError {
        return new ErrorHandler(props, name, status, true);
    }
}