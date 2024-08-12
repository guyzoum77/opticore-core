import {ServerConfigInterface} from "../interfaces/serverConfig.interface";
import {serverListen} from "../../../dist";
import express from "express";
import {getAccessEnv} from "../../domain/env/access.env";
import {dateTimeFormattedUtils} from "./dateTimeFormatted.utils";

const webServer: serverListen = new serverListen();
export const serverParams: ServerConfigInterface = {
    server: webServer.onStartEvent(
        express.application,
        getAccessEnv.appHost,
        Number(getAccessEnv.appPort),
        require.main?.children,
        dateTimeFormattedUtils
    ),
    app: express.application,
    host: getAccessEnv.appHost,
    port: Number(getAccessEnv.appPort),
    mainChildren: require.main?.children,
    dateTimeUtils: dateTimeFormattedUtils
};