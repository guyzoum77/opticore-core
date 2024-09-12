import {ServerListenEvent} from "../events/serverListen.event";
import express from "express";
import {getAccessEnv} from "../../domain/env/access.env";
import {dateTimeFormattedUtils} from "../utils/dateTimeFormatted.utils";


export function setupServerConfig() {
    const app: express.Application = express();
    const webServer: ServerListenEvent = new ServerListenEvent();

    const server = webServer.onStartEvent(app, getAccessEnv.appHost, Number(getAccessEnv.appPort));
    webServer.onListeningEvent(server);
    webServer.onRequestEvent(server, app, getAccessEnv.appHost, Number(getAccessEnv.appPort), dateTimeFormattedUtils);
}