import colors from "ansi-colors";

export function modulesLoadedUtils(allAppRoutes: any, serverWebApp: any, dbConChecker: any) {
    allAppRoutes ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`Routers service`)} `)} has been loaded successfully ${colors.green(`✔`)}`) : "";
    serverWebApp ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`server side`)}`)} has been loaded successfully ${colors.green(`✔`)}`) : "";
    dbConChecker ? console.log(`${colors.whiteBright(`  content`)} ${colors.green('Kernel :')} ${colors.cyan(`${colors.bold(`database checker connection`)}`)} has been loaded successfully ${colors.green(`✔`)}`) : "";
}