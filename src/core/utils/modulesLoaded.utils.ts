import colors from "ansi-colors";
import {LogMessageUtils} from "./logMessage.utils";
import express from "express";

export function modulesLoadedUtils(allAppRoutes: express.Router[], dbConChecker: () => void) {
    LogMessageUtils.success("Kernel", "load kernel", "Modules app have been successfully loaded");
    console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`server side`)}`)} has been loaded successfully ${colors.green(`✔`)}`);
    allAppRoutes ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`Routers service`)} `)} has been loaded successfully ${colors.green(`✔`)}`) : "";
    dbConChecker ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`database checker connection`)}`)} has been loaded successfully ${colors.green(`✔`)}`) : "";
}