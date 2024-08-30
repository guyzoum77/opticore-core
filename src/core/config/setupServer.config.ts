import {ServerListenUtils} from "../utils/serverListen.Utils";
import express from "express";
import {getAccessEnv} from "../../domain/env/access.env";
import {dateTimeFormattedUtils} from "../utils/dateTimeFormatted.utils";


export function setupServerConfig() {
    const app: express.Application = express();
    const webServer: ServerListenUtils = new ServerListenUtils();

    const server = webServer.onStartEvent(app, getAccessEnv.appHost, Number(getAccessEnv.appPort));
    webServer.onListeningEvent(server, app, getAccessEnv.appHost, Number(this.port), dateTimeFormattedUtils);
    webServer.onRequestEvent(server, app, getAccessEnv.appHost, Number(this.port), dateTimeFormattedUtils);
}