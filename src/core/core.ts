import "reflect-metadata";
import {Server as serverWebApp} from "node:net";
import {IncomingMessage, ServerResponse, createServer} from "node:http";
import corsOrigin, {CorsOptions} from "cors";
import express, {Router} from "express";
import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    ExceptionHandlerError as ErrorHandler,
    getEnvVariable,
    requestCallsEvent,
    UtilityUtils,
    currentDate
} from "../index";
import StackTraceError from "./handlers/errors/base/stackTraceError";
import {coreListenerEventLoaderModuleService} from "@/application/services/coreListenerEvent.service";
import {KernelModuleType} from "./types/kernelModule.type";



export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    private expressApp = express();
    private readonly port: number;
    private readonly host: string;

    constructor(corsOriginOptions?: Partial<CorsOptions>) {
        this.port = Number(getEnvVariable.appPort);
        this.host = getEnvVariable.appHost;
        
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(corsOrigin(corsOriginOptions));

        this.stackTraceErrorHandling();
    }

    public onStartServer<T extends express.Router>(routers: Router[]) {
        return createServer().listen(this.port, this.host, (): void => {
            if (this.host === "" && this.port === 0) {
                eventErrorOnListeningServer.hostPortUndefined();
            } else if (this.host === "") {
                eventErrorOnListeningServer.hostUndefined();
            } else if (this.port === 0) {
                eventErrorOnListeningServer.portUndefined();
            } else {
               const routes: Router[] = this.registerRoutes(routers);
                routes.map((route: Router) => {
                    console.log("route stack before : ", route.stack);
                    console.log("route before : ", route);
                    this.expressApp.use(route);
                    console.log("route stack after : ", route.stack);
                    console.log("route after : ", route);
                })
            }
        });
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

    public kernelModules(registerRouter: express.Router[], dbConnection: () => void): KernelModuleType {
       return [registerRouter, dbConnection] as KernelModuleType
    }

    private registerRoutes(appRoutes: Router[]): Router[] {
        return appRoutes.map((route: Router) => this.expressApp.use(route));
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