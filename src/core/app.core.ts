import express, {Router} from "express";
import {getEnvVariable} from "@/domain/env/access.env";
import {IRoutes} from "@/core/interfaces/routes.interface";
import {createServer, IncomingMessage, ServerResponse} from "node:http";
import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    KernelModuleType,
    requestCallsEvent,
    UtilityUtils
} from "../index";
import {Server as serverWebApp} from "net";
import {coreListenerEventLoaderModuleService} from "@/application/services/coreListenerEvent.service";


export class AppCore {
    private serverUtility: UtilityUtils = new UtilityUtils();
    private app: express.Application;
    private readonly port: number;
    private readonly host: string;

    constructor(routes: IRoutes[]) {
        this.app = express();
        this.port = Number(getEnvVariable.appPort);
        this.host = getEnvVariable.appHost;

        this.appRouters(routes);
    }

    public onStartServer() {
        return createServer().listen(this.port, this.host, (): void => {
            if (this.host === "" && this.port === 0) {
                eventErrorOnListeningServer.hostPortUndefined();
            } else if (this.host === "") {
                eventErrorOnListeningServer.hostUndefined();
            } else if (this.port === 0) {
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

    private appRouters(routers: IRoutes[]): void {
        routers.forEach((router: IRoutes): void => {
            console.log("router is : ", router.router);
            this.app.use("/", router.router);
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
}