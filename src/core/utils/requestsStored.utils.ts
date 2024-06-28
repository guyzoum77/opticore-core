import {ExpressRoutesUtils} from "./expressRoutes.utils";
import {express} from "../../index";
import colors from "ansi-colors";

export function requestsStoredUtils(app: express.Application, currentDatePath: string, host: string, port: number) {
    const listRoutes: ExpressRoutesUtils = new ExpressRoutesUtils();
    return listRoutes.expressListRoutes(
        app,
        { color: true}).map((route) => {
            switch (route.method) {
                case 'POST':
                    console.log(`${currentDatePath} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.yellow(`${route.path}`)} - [ Method ] ${colors.yellow(`${route.method}`)}`);
                    break;
                case 'GET':
                    console.log(`${currentDatePath} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.green(`${route.path}`)} - [ Method ] ${colors.green(`${route.method}`)}`);
                    break;
                case 'PUT':
                    console.log(`${currentDatePath} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.blue(`${route.path}`)} - [ Method ] ${colors.blue(`${route.method}`)}`);
                    break;
                case 'DELETE':
                    console.log(`${currentDatePath} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.red(`${route.path}`)} - [ Method ] ${colors.red(`${route.method}`)}`);
                    break;
            }
        }
    );
}