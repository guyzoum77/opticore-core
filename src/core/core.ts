import "reflect-metadata";
import {Server as serverWebApp} from "node:net";
import {IncomingMessage, ServerResponse, createServer} from "node:http";

import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    ExceptionHandlerError as ErrorHandler,
    getEnvVariable,
    requestCallsEvent,
    UtilityUtils,
} from "../index";
import StackTraceError from "./handlers/errors/base/stackTraceError";
import express from "express";
import {KernelModuleInterface} from "./interfaces/kernelModule.interface";
import {coreListenerEventService} from "../application/services/coreListenerEvent.service";
import {KernelModuleType} from "./types/kernelModule.type";


export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    private expressApp: express.Application = express();

    constructor() {
        this.stackTraceErrorHandling();
    }

    private registerRouteApp<T extends express.Router>(routers: T[]): T[] {
        return routers;
    }

    public kernelModules<T extends KernelModuleInterface>(kernel: T[]) {
        let dbConn: (() => void) = (): void => {};
        let routerApp: express.Router[] = [];

        kernel.forEach((module: any): void => {
            typeof module === "function"
                ? dbConn = module as () => void
                : Array.isArray(module)
                    ? routerApp = module as express.Router[]
                    : null;
        });

        return { registerAppRoutes: routerApp, databaseConn: dbConn };
    }

    public onStartServer<T extends express.Router[]>(host: string, port: number, routers: T) {
        return createServer().listen(port, host, (): void => {
            if (host === "" && port === 0) {
                eventErrorOnListeningServer.hostPortUndefined();
            } else if (host === "") {
                eventErrorOnListeningServer.hostUndefined();
            } else if (port === 0) {
                eventErrorOnListeningServer.portUndefined();
            } else {
                this.registerRouteApp(routers).forEach((router: express.Router) => this.expressApp.use(router));
            }
        });
    }

    public onListeningOnServerEvent<T extends KernelModuleType>(serverWeb: serverWebApp, kernelModule: [express.Router[], () => void]): void {
        serverWeb.on(eventName.error, (err: Error): void => {
            eventErrorOnListeningServer.onEventError(err);
        }).on(eventName.close, (): void => {
            eventErrorOnListeningServer.serverClosing();
        }).on(eventName.drop, (): void => {
            eventErrorOnListeningServer.dropNewConnection();
        }).on(eventName.listening, (): void => {
            this.infoWebApp();
            coreListenerEventService(kernelModule);
        });
    }

    public onRequestOnServerEvent(serverWeb: serverWebApp, host: string, port: number, loadingTime: any): void {
        serverWeb.on("request", (req: IncomingMessage, res: ServerResponse): void => {
            requestCallsEvent(req, res, host, port, loadingTime);
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