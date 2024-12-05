import "reflect-metadata";
import {Server as serverWebApp} from "node:net";
import {IncomingMessage, ServerResponse, createServer} from "node:http";
import corsOrigin, {CorsOptions} from "cors";
import {Router} from "express";
import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    ExceptionHandlerError as ErrorHandler,
    getEnvVariable,
    requestCallsEvent,
    UtilityUtils,
    express
} from "../index";
import StackTraceError from "./handlers/errors/base/stackTraceError";
import {coreListenerEventLoaderModuleService} from "../application/services/coreListenerEvent.service";
import {KernelModuleType} from "./types/kernelModule.type";



export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    private expressApp = express();

    constructor(routers: Router[], corsOriginOptions: Partial<CorsOptions>) {
        this.stackTraceErrorHandling();

        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: true }));
        this.expressApp.use(corsOrigin(corsOriginOptions));
        this.appRouters(routers);
    }

    public onStartServer<T extends express.Router>(host: string, port: number) {
        return createServer().listen(port, host, (): void => {
            if (host === "" && port === 0) {
                eventErrorOnListeningServer.hostPortUndefined();
            } else if (host === "") {
                eventErrorOnListeningServer.hostUndefined();
            } else if (port === 0) {
                eventErrorOnListeningServer.portUndefined();
            } else {

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

    public onRequestOnServerEvent(serverWeb: serverWebApp, host: string, port: number, loadingTime: any): void {
        serverWeb.on("request", (req: IncomingMessage, res: ServerResponse): void => {
            requestCallsEvent(req, res, host, port, loadingTime);
        });
    }

    public kernelModules(registerRouter: express.Router[], dbConnection: () => void): KernelModuleType {
       return [registerRouter, dbConnection] as KernelModuleType
    }

    private appRouters(routers: Router[]): void {
        routers.forEach((router: Router): void => {
            this.expressApp.use(router);
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