import {ExpressRoutesUtils} from "./expressRoutes.utils";
import {express} from "../../index";
import colors from "ansi-colors";
import chalk from "chalk";

export function requestsStoredUtils(app: express.Application, loadingTime: any, host: string, port: number) {
    const listRoutes: ExpressRoutesUtils = new ExpressRoutesUtils();
    if (listRoutes.expressListRoutes) {
        const name: string = `${colors.green(` Route stored `)}`;
        console.log(chalk.bgGreen.white(''.padEnd(17, ' ')));
        const msg: string = colors.bold(` ${name}  `);
        console.log(chalk.bgGreen.white(msg.padEnd(17, ' ')));
        console.log(chalk.bgGreen.white(''.padEnd(17, ' ')));

        return listRoutes.expressListRoutes(app, { color: true }).map((route): void => {
            switch (route.method) {
                case 'POST':
                    console.log(`[ ${name} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.yellow(`${route.path}`)} - [ Method ] ${colors.yellow(` ${route.method} `)}`);
                    break;
                case 'GET':
                    console.log(`[ ${name} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.green(`${route.path}`)} - [ Method ] ${colors.green(` ${route.method} `)}`);
                    break;
                case 'PUT':
                    console.log(`[ ${name} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.blue(`${route.path}`)} - [ Method ] ${colors.blue(` ${route.method} `)}`);
                    break;
                case 'DELETE':
                    console.log(`[ ${name} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.red(`${route.path}`)} - [ Method ] ${colors.red(` ${route.method} `)}`);
                    break;
            }
        });
    }
}