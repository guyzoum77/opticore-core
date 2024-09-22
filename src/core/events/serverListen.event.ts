import {express, UtilityUtils, eventProcessHandler} from "../../index";
import {Server} from "node:net";
import colors from "ansi-colors";
import {IncomingMessage, ServerResponse} from "node:http";
import {ServerListenEventError} from "../../errors/serverListen.event.error";


export class ServerListenEvent {
    private utility: UtilityUtils = new UtilityUtils();
    public app: express.Application = express();

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
                ServerListenEventError.hostPortUndefined();
            } else if (host === "") {
                ServerListenEventError.hostUndefined();
            } else if (port === 0) {
                ServerListenEventError.portUndefined();
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
            }
        }).on("error", (err: Error) => {
                ServerListenEventError.onEventError(err);
            }
        );
    }


    /**
     *
     * @param webServer
     *
     * Return
     */
    public onListeningEvent(webServer: Server) {
        webServer.on("listening", () => {});
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
            const name: string = `${colors.white(` ${currentDatePath} `)}`; // @ts-ignore
            if( req.originalUrl === "undefined") {
                console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] The route do not exist. - [ Status ] ${colors.red(`${colors.white(` 404 `)}`)}`)
            } else {
                switch (res.statusCode) {
                    case 200:
                        switch (req.method) {
                            case 'POST': // @ts-ignore
                                console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgCyan(`${colors.white(` 200 `)}`)}`)
                                break;
                            case 'GET':
                            case 'PUT': // @ts-ignore
                                console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(` 200 `)}`)}`);
                                break;
                            case 'DELETE': // @ts-ignore
                                console.log(`[ ${colors.cyan(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgGreen(`${colors.white(` Success `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.bgCyan(`${colors.white(` 200 `)}`)}`);
                                break;
                        }
                        break;
                    case 404:
                        switch (req.method) {
                            case 'POST': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.red(`${colors.white(` 404 `)}`)}`);
                                break;
                            case 'GET': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 404 `)}`)}`);
                                break;
                            case 'PUT': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 404 `)}`)}`);
                                break;
                            case 'DELETE': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ] ${loadingTime} | ${colors.bgRed(`${colors.white(` Not found `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 404 `)}`)}`);
                                break;
                        }
                        break;
                    case 401:
                        switch (req.method) {
                            case 'POST': // @ts-ignore
                                console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                                break;
                            case 'GET': // @ts-ignore
                                console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                                break;
                            case 'PUT': // @ts-ignore
                                console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                                break;
                            case 'DELETE': // @ts-ignore
                                console.log(`[ ${colors.yellowBright(`${currentDatePath}`)} ] ${loadingTime} |  ${colors.bgYellowBright(`${colors.white(` Unauthorized `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.bgYellow(`${colors.bold(` 401 `)}`)}`);
                                break;
                        }
                        break;
                    case 500:
                        switch (req.method) {
                            case 'POST': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                                break;
                            case 'GET': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                                break;
                            case 'PUT': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                                break;
                            case 'DELETE': // @ts-ignore
                                console.log(`[ ${colors.red(`${currentDatePath}`)} ]  ${loadingTime} | ${colors.bgRed(`${colors.white(` Server error `)}`)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ query ] ${JSON.stringify(req.query)} - [ params ] ${JSON.stringify(req.params)} - [ Status ] ${colors.red(`${colors.bold(` 500 `)}`)}`);
                                break;
                        }
                        break;
                    default: // @ts-ignore
                        console.log(`[ ${colors.blueBright(`${currentDatePath}`)} ] ${loadingTime} | ${colors.blueBright(` ${res.statusMessage} `)} [ Host ] http://${host}:${port} - [ Route ] ${req.originalUrl} - [ Status ] ${colors.blueBright(` ${res.req.socket._httpMessage.statusCode} `)}`);
                        break;
                }
            }
        });
    }

    public stackTraceErrorHandling(): void {
        eventProcessHandler();
    }
}