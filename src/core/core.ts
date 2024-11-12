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
    express
} from "../index";
import StackTraceError from "./handlers/errors/base/stackTraceError";
import {coreListenerEventLoaderModuleService} from "../application/services/coreListenerEvent.service";
import {KernelModuleType} from "./types/kernelModule.type";


export class CoreApplication {
    private serverUtility: UtilityUtils = new UtilityUtils();
    private expressApp: express.Application = express();

    constructor() {
        this.stackTraceErrorHandling();
    }

    public onStartServer<T extends express.Router>(host: string, port: number, routers: T[]) {
        return createServer().listen(port, host, (): void => {
            if (host === "" && port === 0) {
                eventErrorOnListeningServer.hostPortUndefined();
            } else if (host === "") {
                eventErrorOnListeningServer.hostUndefined();
            } else if (port === 0) {
                eventErrorOnListeningServer.portUndefined();
            } else {
                const register: T[] = this.registerRoutes(this.expressApp, routers);
                register.forEach((router: T): void => {
                    console.log("router before use is : ", router);
                    this.expressApp.use(router);
                    console.log("router after use is : ", router);
                    console.log("Mounted route:", router.stack); // Check route stack
                });
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

    private registerRoutes<T extends express.Router>(app: express.Application, routers: Array<() => T[]>): T[] {
        let registeredRouters: T[] = [];

        routers.forEach((routerFn: () => T[], index: number): void => {
            if (typeof routerFn !== 'function') {
                console.error(`Router at index ${index} is not a function.`);
                throw new TypeError(`Router at index ${index} is not a function.`);
            }

            const routes: T[] = routerFn();
            if (!Array.isArray(routes)) {
                console.error(`Router function at index ${index} did not return an array.`);
                throw new TypeError(`Router function at index ${index} did not return an array.`);
            }

            routes.forEach((router: T): void => {
                app.use(router); // Mount each router on the app
                registeredRouters.push(router);
            });
        });

        return registeredRouters;
    };

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