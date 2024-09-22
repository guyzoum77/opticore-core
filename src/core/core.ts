import "reflect-metadata";
import {modulesLoadedUtils as loadedModules} from "./utils/modulesLoaded.utils";
import {Server as serverWebApp} from "net";
import {IncomingMessage, ServerResponse} from "node:http";
import express from "express";
import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    getEnvVariable,
    requestCallsEvent,
    UtilityUtils
} from "../index";
import corsOrigin, {CorsOptions} from "cors";
import {OptionsUrlencoded} from "body-parser";


export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    public appExpress: express.Application = express();

    constructor(coreOptions: CorsOptions, optionsUrlencoded: OptionsUrlencoded, setting: string, val: any) {
        this.stackTraceErrorHandling();
        this.appExpress.use(express.json());
        this.appExpress.use(express.urlencoded(optionsUrlencoded));
        this.appExpress.use(corsOrigin(coreOptions));
        this.appExpress.set(setting, val);
    }

    public onStartEvent(host: string, port: number): serverWebApp {
        return this.appExpress.listen(port, host, (): void => {
            host === "" && port === 0
                ? eventErrorOnListeningServer.hostPortUndefined()
                : host === ""
                    ? eventErrorOnListeningServer.hostUndefined()
                    : port === 0
                        ? eventErrorOnListeningServer.portUndefined()
                        : "";
        });
    }

    public onListeningEvent(serverWeb: serverWebApp, host: string, port: number, kernelModule: [express.Router[], () => void]): void {
        serverWeb.on(eventName.error, (err: Error): void => {
            eventErrorOnListeningServer.onEventError(err);
        }).on(eventName.close, (): void => {
            eventErrorOnListeningServer.serverClosing();
        }).on(eventName.drop, (): void => {
            eventErrorOnListeningServer.dropNewConnection();
        }).on(eventName.listening, (): void => {
            this.infoWebApp();
            let router;
            let dbCon;
            kernelModule.map((module: express.Router[] | (() => void)): void => {
                typeof express.Router === module ? router = module : dbCon = module
            });
            loadedModules(router, dbCon);
        });
    }

    public onRequestEvent(serverWeb: serverWebApp, host: string, port: number, loadingTime: any): void {
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
}
