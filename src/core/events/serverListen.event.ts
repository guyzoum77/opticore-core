import {express, UtilityUtils, eventProcessHandler} from "../../index";
import {Server} from "node:net";
import {IncomingMessage, ServerResponse} from "node:http";
import {ServerListenEventError} from "../../errors/serverListen.event.error";
import {requestCallsEvent} from "./requestCalls.event";


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
     * @param host
     * @param port
     * @param loadingTime
     */
    public onRequestEvent(webServer: Server, host: string, port: number, loadingTime: any) {
        webServer.on("request", (req: IncomingMessage, res: ServerResponse) => {
            requestCallsEvent(req, res, host, port, loadingTime);
        });
    }

    public stackTraceErrorHandling(): void {
        eventProcessHandler();
    }
}