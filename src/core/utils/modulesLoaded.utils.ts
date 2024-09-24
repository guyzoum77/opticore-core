import colors from "ansi-colors";
import {LogMessageUtils} from "./logMessage.utils";
import express from "express";
import {dateTimeFormattedUtils} from "./dateTimeFormatted.utils";

export function modulesLoadedUtils(allAppRoutes: express.Router[], dbConChecker: () => void) {
    LogMessageUtils.success("Kernel", "load kernel", "Modules app have been successfully loaded");
    console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`server side`)}`)} has been loaded successfully ${colors.green(`✔`)}`);
    allAppRoutes
        ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`Routers service`)} `)} has been loaded successfully ${colors.green(`✔`)}`)
        : console.log(`${colors.red(`✘`)} ${colors.bgRed(` ${colors.bold(`${colors.white(` Register routes `)}`)} `)} | ${dateTimeFormattedUtils} | [ ${colors.red(`${colors.bold(` fail `)}`)} ] | [ ${colors.bold(` loading `)} ] - ${colors.red(` routers `)} - The route register failed to load `);
    typeof dbConChecker == "function"
        ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`database checker connection`)}`)} has been loaded successfully ${colors.green(`✔`)}`)
        : "";
    console.log("");
}