import {dateTimeFormattedUtils} from "../utils/dateTimeFormatted.utils";
import express from "express";
import {Server} from "node:net";

export interface ServerConfigInterface {
    server: Server;
    app: express.Application;
    host: string;
    port: number;
    dateTimeUtils: typeof dateTimeFormattedUtils;
}