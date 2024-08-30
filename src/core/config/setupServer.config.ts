import {ServerListenUtils} from "../utils/serverListen.Utils";
import express from "express";
import {getAccessEnv} from "../../domain/env/access.env";
import {dateTimeFormattedUtils} from "../utils/dateTimeFormatted.utils";


export function setupServerConfig() {
    const app: express.Application = express();
    const appModules: NodeJS.Module[] | undefined = require.main?.children;
    const webServer: ServerListenUtils = new ServerListenUtils();

    const server = webServer.onStartEvent(app, getAccessEnv.appHost, Number(getAccessEnv.appPort));
    this.webServer.onListeningEvent(server, app, getAccessEnv.appHost, Number(this.port), dateTimeFormattedUtils);
    this.webServer.onRequestEvent(server, app, getAccessEnv.appHost, Number(this.port), dateTimeFormattedUtils);
}