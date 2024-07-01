import {ExpressRoutesUtils} from "./expressRoutes.utils";
import {express} from "../../index";
import colors from "ansi-colors";

export function requestsStoredUtils(app: express.Application, loadingTime: any, host: string, port: number) {
    const name: string = `[${colors.green(` Route stored `)}] ${loadingTime}`;
    const listRoutes: ExpressRoutesUtils = new ExpressRoutesUtils();
    if (listRoutes.expressListRoutes) {
        return listRoutes.expressListRoutes(
            app,
            { color: true }
        ).map((route) => {
                switch (route.method) {
                    case 'POST':
                        console.log(`${name} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.yellow(`${route.path}`)} - [ Method ] ${colors.yellow(`${route.method}`)}`);
                        break;
                    case 'GET':
                        console.log(`${name} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.green(`${route.path}`)} - [ Method ] ${colors.green(`${route.method}`)}`);
                        break;
                    case 'PUT':
                        console.log(`${name} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.blue(`${route.path}`)} - [ Method ] ${colors.blue(`${route.method}`)}`);
                        break;
                    case 'DELETE':
                        console.log(`${name} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.red(`${route.path}`)} - [ Method ] ${colors.red(`${route.method}`)}`);
                        break;
                }
            }
        );
    }
}