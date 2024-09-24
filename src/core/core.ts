import "reflect-metadata";
import {modulesLoadedUtils as loadedModules} from "./utils/modulesLoaded.utils";
import {Server as serverWebApp} from "net";
import {IncomingMessage, ServerResponse} from "node:http";
import express from "express";
import {
    eventErrorOnListeningServer,
    eventName,
    eventProcessHandler,
    Exception as msg, ExceptionHandlerError as ErrorHandler,
    getEnvVariable,
    HttpStatusCodesConstant as status,
    LogMessageUtils as log,
    requestCallsEvent,
    UtilityUtils
} from "../index";
import corsOrigin, {CorsOptions} from "cors";
import {OptionsUrlencoded} from "body-parser";
import StackTraceError from "./handlers/errors/base/stackTraceError";


export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    public appExpress: express.Application = express();

    constructor(corsOptions: Partial<CorsOptions> = {},
                optionsUrlencoded: Partial<OptionsUrlencoded> = {},
                setting: Partial<string> = "",
                val: Partial<string> = "") {
        this.appExpress.use(express.json());
        this.appExpress.use(express.urlencoded(optionsUrlencoded));
        this.appExpress.use(corsOrigin(corsOptions));
        this.appExpress.set(setting, val);
        this.stackTraceErrorHandling();
    }

    private registerRouteApp(routers: express.Router[]) {
        return routers;
    }

    public onStartServer(host: string, port: number, routers: express.Router[]): serverWebApp {
        return this.appExpress.listen(port, host, (): void => {
            host === "" && port === 0
                ? eventErrorOnListeningServer.hostPortUndefined()
                : host === ""
                    ? eventErrorOnListeningServer.hostUndefined()
                    : port === 0
                        ? eventErrorOnListeningServer.portUndefined()
                        : this.registerRouteApp(routers);
        });
    }

    public onListeningOnServerEvent(serverWeb: serverWebApp,
                                    host: string,
                                    port: number,
                                    kernelModule: [express.Router[], () => void]): void {
        serverWeb.on(eventName.error, (err: Error): void => {
            eventErrorOnListeningServer.onEventError(err);
        }).on(eventName.close, (): void => {
            eventErrorOnListeningServer.serverClosing();
        }).on(eventName.drop, (): void => {
            eventErrorOnListeningServer.dropNewConnection();
        }).on(eventName.listening, (): void => {
            this.infoWebApp();
            let router: express.Router[] | undefined;
            let dbCon: (() => void) | undefined;
            kernelModule.forEach((module: express.Router[] | (() => void)): void => {
                if (Array.isArray(module)) {
                    router = module as express.Router[];
                } else if (typeof module === "function") {
                    dbCon = module as () => void;
                }
            });

            if (router && dbCon) {
                loadedModules(router, dbCon);
                ((): void => { dbCon(); })();
            } else {
                const stackTrace: StackTraceError = this.traceError(msg.loadedModulesError, msg.loadedModules, status.NOT_ACCEPTABLE);
                log.error(
                    msg.loadedModules,
                    "error",
                    "loading error",
                    stackTrace.stack,
                    stackTrace.name,
                    msg.loadedModulesError,
                    status.SERVICE_UNAVAILABLE
                );
                throw new Error(stackTrace.message);
            }
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