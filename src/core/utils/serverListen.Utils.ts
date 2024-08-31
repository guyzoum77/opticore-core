import {express, HttpStatusCodesConstant as status, LogMessageUtils, requestsStoredUtils, UtilityUtils} from "../../index";
import {Server} from "node:net";
import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";
import EventEmitter from "node:events";
import chalk from "chalk";
import {EventConstant as event} from "./constants/event.constant";
import {eventNameErrorConstant as eventName} from "./constants/eventNameError.constant";
import {MessagesException as msg} from "../../application/exceptions/messages.exception";


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
     *
     * Return node server
     */
    public onStartEvent(app: express.Application, host: string, port: number): Server {
        return app.listen(port, host, (): void => {
            if (host === "" && port === 0) {
                LogMessageUtils.error(msg.webServer, msg.listening, msg.webHost, msg.badHost, msg.hostNotFound, msg.errorHostUrl, status.BAD_REQUEST);
                process.exit();
            } else if (host === "") {
                LogMessageUtils.error(msg.webServer, msg.listening, msg.webHost, msg.badHost, msg.hostNotFound, msg.errorHost, status.BAD_REQUEST);
                process.exit();
            } else if (port === 0) {
                LogMessageUtils.error(msg.webServer, msg.listening, msg.webHost, msg.badPort, msg.badPort, msg.errorPort, status.BAD_REQUEST);
                process.exit();
            } else {
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
            }
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
     * @param loadingTime
     *
     * Return
     */
    public onListeningEvent(webServer: Server, app: express.Application, host: string, port: number, loadingTime: any) {
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
     * @param loadingTime
     */
    public onRequestEvent(webServer: Server, app: express.Application, host: string, port: number, loadingTime: any) {
        webServer.on("request", (req: IncomingMessage, res: ServerResponse) => {
            const currentDatePath: string = `Request called`;
            const name: string = `${colors.white(` ${currentDatePath} `)}`;
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
            setTimeout(() => {
                console.log();
                LogMessageUtils.error(
                    "BeforeExit",
                    "process before exit",
                    `exit code: ${code}`,
                    "before exit",
                    "exit with code",
                    `Process will exit with code: ${code}`,
                    status.SERVICE_UNAVAILABLE
                );
                process.exit(code)
            }, 100)

        });

        process.on(event.disconnect, () => {
            LogMessageUtils.error(
                "Disconnected",
                "process disconnected",
                `disconnected`,
                "child process",
                "process disconnected",
                "Child process disconnected",
                status.SERVICE_UNAVAILABLE
            );
            process.exit();
        });

        process.on(event.exit, (code: number) => {
            switch (code) {
                case 0:
                    LogMessageUtils.success(
                        "Exited",
                        "completed",
                        "The process finished as expected and everything worked correctly"
                    );
                    break;
                case 1:
                    LogMessageUtils.error(
                        "Exited",
                        "General Errors",
                        `errors`,
                        "exit",
                        "exit with code",
                        "Something went wrong",
                        status.SERVICE_UNAVAILABLE
                    );
                    break
                case 2:
                    LogMessageUtils.error(
                        "Exited",
                        "Misuse of shell builtins",
                        `Misuse`,
                        "Incorrect use",
                        "shell commands",
                        "Incorrect using of shell commands",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 126:
                    LogMessageUtils.error(
                        "Exited",
                        "Command invoked cannot execute",
                        `command invoked`,
                        "invoked",
                        "not executable",
                        "The command is found but is not executable (e.g., trying to execute a directory)",
                        status.SERVICE_UNAVAILABLE
                    );
                    break
                case 127:
                    LogMessageUtils.error(
                        "Exited",
                        "Command not found",
                        `command not found`,
                        "not found",
                        "not found",
                        "The command was not found in the system's PATH or is misspelled",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 128:
                    LogMessageUtils.error(
                        "Exited",
                        "Invalid argument to exit",
                        "Invalid argument",
                        "argument to exit",
                        "invalid argument",
                        "The command was not found in the system's PATH or is misspelled",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 130:
                    LogMessageUtils.error(
                        "Exited",
                        "Script terminated by Control-C",
                        "Script terminated",
                        "terminated",
                        "terminated by Control-C",
                        "Indicates that the script was manually terminated by the user using the Control-C (SIGINT) signal",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 137:
                    LogMessageUtils.error(
                        "Exited",
                        "Termination by SIGKILL (or out of memory)",
                        "termination",
                        "SIGKILL",
                        "termination by SIGKILL",
                        "Indicates that the process was terminated by a SIGKILL signal, possibly due to an out-of-memory situation",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 139:
                    LogMessageUtils.error(
                        "Exited",
                        "Segmentation fault",
                        "Segmentation",
                        "illegal memory address",
                        "process accessed",
                        "Indicates that the process accessed an illegal memory address (segfault)",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 143:
                    LogMessageUtils.error(
                        "Exited",
                        "termination by SIGTERM",
                        "termination",
                        "fault",
                        "process received a SIGTERM",
                        "Indicates that the process received a SIGTERM signal to terminate",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                case 255:
                    LogMessageUtils.error(
                        "Exited",
                        "exit status out of range",
                        "out of range",
                        "status out",
                        "exit status out",
                        "Indicates an exit code that is outside the allowable range (0-255 for Unix-like systems)",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
                default:
                    LogMessageUtils.error(
                        "Exited",
                         "Errors",
                        `errors`,
                        "exit",
                        "exit with code",
                        "Error is occurring",
                        status.SERVICE_UNAVAILABLE
                    );
                    break;
            }
        });

        process.on(event.rejectionHandled, (promise: Promise<any>) => {
            LogMessageUtils.error(
                "PromiseRejectionHandled",
                "rejection promise",
                "rejection",
                "RejectionHandled",
                "promise",
                `Promise rejection is handled at : ${promise}`,
                status.SERVICE_UNAVAILABLE
            );
        });
        process.on(event.uncaughtException, (error: any) => {
            if (error.message === "'app.router' is deprecated") {
                console.log("");
            } else {
                LogMessageUtils.error(
                    "UncaughtException",
                    "uncaught exception handled",
                    "exception",
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            }
        });
        process.on(event.uncaughtExceptionMonitor, (error: any) => {
            if (error.message === "'app.router' is deprecated") {
                console.log("");
            } else {
                LogMessageUtils.error(
                    "UncaughtExceptionMonitor",
                    "uncaught exception handled",
                    "exception",
                    error.stack,
                    error.name,
                    error.message,
                    status.SERVICE_UNAVAILABLE
                );
            }
        });
        process.on(event.unhandledRejection, (reason: any, promise: Promise<any>) => {
            LogMessageUtils.error(
                "UnhandledRejection",
                "Unhandled rejection",
                "exception",
                "unhandledRejection",
                "unhandledRejection",
                `Unhandled Rejection at: Promise ${promise} -- reason ${reason}`,
                status.SERVICE_UNAVAILABLE
            );
        });
        process.on(event.warning, (warning: any) => {
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
        process.on(event.message, (message: any) => {
            LogMessageUtils.error(
                "Message",
                "message exception",
                "message",
                "Process message received",
                "message received",
                `process got message ${message}`,
                status.SERVICE_UNAVAILABLE
            );
        });
        process.on(event.multipleResolves, (type: string, promise: Promise<any>, reason: any) => {
            LogMessageUtils.error(
                "multipleResolves",
                "resolves",
                "resolves detected",
                "detection",
                `Multiple resolves detected : ${type}`,
                `${promise} -- ${reason}`,
                status.SERVICE_UNAVAILABLE
            );
        });

        // Handle specific signals
        process.on(event.sigint, () => {
            LogMessageUtils.error(
                "SIGINT",
                "SIGINT",
                "SIGINT",
                "received",
                "SIGINT",
                `Process ${process.pid} has been interrupted`,
                status.NOT_ACCEPTABLE
            );
            process.exit(0);
        });
        process.on(event.sigterm, (signal) => {
            LogMessageUtils.error(
                "SIGTERM",
                "SIGTERM",
                "SIGTERM",
                "received",
                signal,
                `Process ${process.pid} received a SIGTERM signal`,
                status.NOT_ACCEPTABLE
            );
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