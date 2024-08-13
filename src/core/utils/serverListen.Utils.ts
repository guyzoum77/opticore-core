import {express, HttpStatusCodesConstant as status, LogMessageUtils, requestsStoredUtils, UtilityUtils} from "../../index";
import {Server} from "node:net";
import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";
import EventEmitter from "node:events";
import chalk from "chalk";
import {EventConstant as event} from "./constants/event.constant";
import {eventNameErrorConstant as eventName} from "./constants/eventNameError.constant";


export class ServerListenUtils {
    private utility: UtilityUtils = new UtilityUtils();
    public app: express.Application = express();
    public errorEmitter: EventEmitter = new EventEmitter();

    constructor() {
        this.stackTraceErrorHandling();
    }

    /**
     *
     * @param app
     * @param host
     * @param port
     * @param appModules
     * @param loadingTime
     *
     * Return node server
     */
    public onStartEvent(app: express.Application, host: string, port: number, appModules: NodeJS.Module[] | undefined, loadingTime: any): Server {
        return app.listen(port, host, (): void => {
            this.utility.infoServer(
                this.utility.getVersions().nodeVersion,
                this.utility.getProjectInfo().startingTime,
                host,
                port,
                this.utility.getUsageMemory().rss,
                this.utility.getUsageMemory().heapUsed,
                this.utility.getUsageMemory().user,
                this.utility.getUsageMemory().system
            );
            console.log('');
        }).on("error", (err: Error) => {
            LogMessageUtils.error(
                "Server start error",
                "Error",
                "Stack trace error",
                err.stack,
                err.name,
                err.message,
                status.SERVICE_UNAVAILABLE
            );
        });
    }


    /**
     *
     * @param webServer
     * @param app
     * @param host
     * @param port
     * @param appModules
     * @param loadingTime
     *
     * Return
     */
    public onListeningEvent(webServer: Server, app: express.Application, host: string, port: number, appModules: NodeJS.Module[] | undefined, loadingTime: any) {
        webServer.on(
            "listening",
            () => {
                requestsStoredUtils(app, loadingTime, host, port);
            }
        );
    }

    /**
     *
     * @param webServer
     * @param app
     * @param host
     * @param port
     * @param appModules
     * @param loadingTime
     */
    public onRequestEvent(webServer: Server, app: express.Application, host: string, port: number, appModules: NodeJS.Module[] | undefined, loadingTime: any) {
        webServer.on("request", (req: IncomingMessage, res: ServerResponse) => {
            const currentDatePath: string = `Request called`;
            const name: string = `${colors.green(` ${currentDatePath} `)}`;
            console.log('');
            console.log(chalk.bgGreen.white(''.padEnd(18, ' ')));
            const msg: string = colors.bold(` ${name} `);
            console.log(chalk.bgGreen.white(msg.padEnd(17, ' ')));
            console.log(chalk.bgGreen.white(''.padEnd(18.5, ' ')));

            switch (res.statusCode) {
                case 200:
                    switch (req.method) {
                        case 'POST': // @ts-ignore
                            console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(`Success`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgCyan(`${colors.white(`200`)}`)}`)
                            break;
                        case 'GET': // @ts-ignore
                            console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(`Success`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(`200`)}`)}`);
                            break;
                        case 'PUT': // @ts-ignore
                            console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(`Success`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(`200`)}`)}`);
                            break;
                        case 'DELETE': // @ts-ignore
                            console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(`Success`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(`200`)}`)}`);
                            break;
                    }
                    break;
                case 404:
                    switch (req.method) {
                        case 'POST': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(`Not found`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.red(`${colors.white(`404`)}`)}`);
                            break;
                        case 'GET': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(`Not found`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(`404`)}`)}`);
                            break;
                        case 'PUT': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(`Not found`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(`404`)}`)}`);
                            break;
                        case 'DELETE': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(`Not found`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(`404`)}`)}`);
                            break;
                    }
                    break;
                case 401:
                    switch (req.method) {
                        case 'POST': // @ts-ignore
                            console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(`Unauthorized`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(`401`)}`)}`);
                            break;
                        case 'GET': // @ts-ignore
                            console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(`Unauthorized`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(`401`)}`)}`);
                            break;
                        case 'PUT': // @ts-ignore
                            console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(`Unauthorized`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(`401`)}`)}`);
                            break;
                        case 'DELETE': // @ts-ignore
                            console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(`Unauthorized`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(`401`)}`)}`);
                            break;
                    }
                    break;
                case 500:
                    switch (req.method) {
                        case 'POST': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(`Server error`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.red(`${colors.bold(`500`)}`)}`);
                            break;
                        case 'GET': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(`Server error`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(`500`)}`)}`);
                            break;
                        case 'PUT': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(`Server error`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(`500`)}`)}`);
                            break;
                        case 'DELETE': // @ts-ignore
                            console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(`Server error`)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(`500`)}`)}`);
                            break;
                    }
                    break;
                default: // @ts-ignore
                    console.log(`[ ${colors.blueBright(`${currentDatePath}`)} ] ${loadingTime} | ${colors.blueBright(`${res.statusMessage}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.blueBright(` ${res.req.socket._httpMessage.statusCode} `)}`);
                    break;
            }
        });
    }

    public stackTraceErrorHandling(): void {
        // Listener for error events
        this.errorEmitter.on(eventName.error, (error: Error): void => {
            LogMessageUtils.error(
                "Event error",
                "Error",
                "Stack trace error",
                error,
                "error",
                error,
                status.SERVICE_UNAVAILABLE
            );
        });

        // Catch uncaught exceptions
        /**
         *  Process event listeners
         */
        process.on(event.beforeExit, (code: number) => {
            this.errorEmitter.emit(eventName.error, (error: Error) => {
                LogMessageUtils.error(
                    "BeforeExit",
                    "process before exit",
                    `exit code: ${code}`,
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.disconnect, () => {
            this.errorEmitter.emit(eventName.error, (error: Error) => {
                LogMessageUtils.error(
                    "Disconnected",
                    "process disconnected",
                    `disconnected`,
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.exit, (code: number) => {
            this.errorEmitter.emit(eventName.error, (error: Error) => {
                LogMessageUtils.error(
                    "Exited",
                    "process exited",
                    `exited code: ${code}`,
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.rejectionHandled, (promise: Promise<any>) => {
            this.errorEmitter.emit(eventName.error, (error: Error) => {
                LogMessageUtils.error(
                    "PromiseRejectionHandled",
                    "rejection promise",
                    "rejection",
                    error.stack,
                    error.name,
                    `${error.message} : ${promise}`,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.uncaughtException, (error: Error) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "UncaughtException",
                    "uncaught exception handled",
                    "exception",
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.uncaughtExceptionMonitor, (error: Error) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "UncaughtExceptionMonitor",
                    "uncaught exception handled",
                    "exception",
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.unhandledRejection, (reason: any, promise: Promise<any>) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "UnhandledRejection",
                    "Unhandled rejection",
                    "exception",
                    "unhandledRejection",
                    "unhandledRejection",
                    `${reason} -- ${promise}`,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.warning, (warning: Error) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "Warning",
                    "warning",
                    "warning",
                    warning.stack,
                    warning.name,
                    warning.message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.message, (message: any, sendHandle: any) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "Message",
                    "message exception",
                    "message",
                    "Process message received",
                    "message received",
                    message,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.multipleResolves, (type: string, promise: Promise<any>, value: any) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "multipleResolves",
                    "resolves",
                    "resolves detected",
                    "detection",
                    "Multiple resolves detected",
                    `${type} -- ${promise} -- ${value.toString()}`,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        process.on(event.worker, (worker: any) => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "worker",
                    "Worker event",
                    "event detected",
                    "detection",
                    "Worker event detected",
                    worker,
                    status.SERVICE_UNAVAILABLE
                );
            });
        });

        // Handle specific signals
        process.on(event.sigint, () => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "SIGINT",
                    "SIGINT",
                    "SIGINT",
                    "received",
                    "SIGINT",
                    "Process received SIGINT",
                    status.NOT_ACCEPTABLE
                );
            });
            process.exit(0);
        });

        process.on(event.sigterm, () => {
            this.errorEmitter.emit(eventName.error, () => {
                LogMessageUtils.error(
                    "SIGTERM",
                    "SIGTERM",
                    "SIGTERM",
                    "received",
                    "SIGTERM",
                    "Process received SIGTERM",
                    status.NOT_ACCEPTABLE
                );
            });
            process.exit(0);
        });


        // Express error-handling middleware
        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (err) {
                this.errorEmitter.emit(eventName.error, err);
                res.status(500).send('An internal server error occurred');
                LogMessageUtils.error(
                    "Express error-handling middleware",
                    "Express error",
                    "Stack trace error",
                    err.stack,
                    err.name,
                    err.message,
                    status.SERVICE_UNAVAILABLE
                )
            } else {
                next();
            }
        });
    }
}