import {ServerListenUtils} from "../utils/serverListen.Utils";
import {ServerConfigInterface} from "../interfaces/serverConfig.interface";


export function setupServerConfig(webServer: ServerListenUtils, config: ServerConfigInterface) {
    const { server, app, host, port, dateTimeUtils } = config;

    webServer.onStartEvent(app, host, port);
    webServer.onListeningEvent(server, app, host, port, dateTimeUtils);
    webServer.onRequestEvent(server, app, host, port, dateTimeUtils);
}