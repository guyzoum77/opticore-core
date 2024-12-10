import "reflect-metadata";
import {Server as serverWebApp} from "node:net";
import {IncomingMessage, ServerResponse, createServer} from "node:http";
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
    currentDate, RegisterCoreRouteRouter, IRouteDefinition, HttpStatusCodesConstant as status
} from "../index";
import StackTraceError from "./handlers/errors/base/stackTraceError";
import {coreListenerEventLoaderModuleService} from "@/application/services/coreListenerEvent.service";
import {KernelModuleType} from "./types/kernelModule.type";
import {TAnyFunction} from "@/core/types/anyFunction.type";



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

        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(corsOrigin(corsOriginOptions));

        this.stackTraceErrorHandling();
    }

    public onStartServer(argFn: TAnyFunction) {
        return createServer().listen(
            this.port,
            this.host,
            (): void => {
                try {
                    if (this.host === "" && this.port === 0) {
                        eventErrorOnListeningServer.hostPortUndefined();
                    } else if (this.host === "") {
                        eventErrorOnListeningServer.hostUndefined();
                    } else if (this.port === 0) {
                        eventErrorOnListeningServer.portUndefined();
                    } else {
                        argFn();
                    }
                } catch (err: any) {
                    this.traceError(err.message, "Error", status.NOT_ACCEPTABLE);
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