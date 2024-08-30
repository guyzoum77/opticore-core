import {ServerConfigInterface} from "../interfaces/serverConfig.interface";

import express from "express";
import {getAccessEnv} from "../../domain/env/access.env";
import {dateTimeFormattedUtils} from "./dateTimeFormatted.utils";
import {ServerListenUtils} from "./serverListen.Utils";
import {Server} from "node:net";

//const webServer: ServerListenUtils = new ServerListenUtils();
export const serverParams: ServerConfigInterface = {
    server: Server,
    app: express.application,
    host: getAccessEnv.appHost,
    port: Number(getAccessEnv.appPort),
    dateTimeUtils: dateTimeFormattedUtils
};