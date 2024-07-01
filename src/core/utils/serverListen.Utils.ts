import {express, requestsStoredUtils, UtilityUtils} from "../../index";
import {Server} from "node:net";
import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";
import EventEmitter from "node:events";
import chalk from "chalk";


export class ServerListenUtils {
    private utility: UtilityUtils = new UtilityUtils();
    public app: express.Application = express();
    public errorEmitter: EventEmitter = new EventEmitter();

    /**
     *
     * @param app
     * @param host
     * @param port
     * @param appModules
     * @param loadingTime
     *
     * Return
     */
    public onStartEvent(app: express.Application, host: string, port: number, appModules: NodeJS.Module[] | undefined,
                        loadingTime: any): Server {
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
            this.utility.loadMainAppEntry(appModules, loadingTime);
            this.utility.loadRouterModule(appModules, loadingTime);
            console.log('');
            this.utility.loadFeaturesModulesCreated(appModules, loadingTime);
            console.log('');
        }).on("error", (err: Error) => {
            console.error("Stack trace error is :", err);
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
    public onListeningEvent(webServer: Server, app: express.Application, host: string, port: number,
                                     appModules: NodeJS.Module[] | undefined, loadingTime: any) {
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
    public onRequestEvent(webServer: Server, app: express.Application, host: string, port: number,
                                     appModules: NodeJS.Module[] | undefined, loadingTime: any) {
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
                    console.log(`[ ${colors.white(`${currentDatePath}`)} ] ${loadingTime} | ${colors.white(`${res.statusMessage}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.white(`${res.req.socket._httpMessage.statusCode}`)}`);
                    break;
            }
        });
    }

    public stackTraceErrorHandling() {
        // Listener for error events
        this.errorEmitter.on('error', (error: Error) => {
            console.error('An error occurred:', error.stack);
            // You can also log the error to a file or send it to an external service here
        });

        // Catch uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            this.errorEmitter.emit('error', error);
        });

        // Catch unhandled promise rejections
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            const error: Error = new Error(`Unhandled Rejection: ${reason}`);
            this.errorEmitter.emit('error', error);
        });

        // Express error-handling middleware
        this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (err) {
                this.errorEmitter.emit('error', err);
                console.log("error stack is :", err);
                res.status(500).send('An internal server error occurred');
            } else {
                next();
            }
        });
    }
}