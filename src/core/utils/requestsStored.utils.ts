import {ExpressRoutesUtils} from "./expressRoutes.utils";
import colors from "ansi-colors";
import express from "express";

export function requestsStoredUtils(app: express.Application, loadingTime: any, host: string, port: number) {
    const listRoutes: ExpressRoutesUtils = new ExpressRoutesUtils();
    if (listRoutes.expressListRoutes) {
        const name: string = `${colors.white(` Route stored `)}`;

        return listRoutes.expressListRoutes(app, { color: true }).map((route): void => {
            switch (route.method) {
                case 'POST':
                    console.log(`[ ${colors.cyan(` ${name} `)} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.yellow(`${route.path}`)} - [ Method ] ${colors.yellow(` ${route.method} `)}`);
                    break;
                case 'GET':
                    console.log(`[ ${colors.cyan(` ${name} `)} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.green(`${route.path}`)} - [ Method ] ${colors.green(` ${route.method} `)}`);
                    break;
                case 'PUT':
                    console.log(`[ ${colors.cyan(` ${name} `)} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.blue(`${route.path}`)} - [ Method ] ${colors.blue(` ${route.method} `)}`);
                    break;
                case 'DELETE':
                    console.log(`[ ${colors.cyan(` ${name} `)} ] | ${loadingTime} | ${colors.cyan(`info`)} [ ${colors.white(`Host`)} ] ${colors.green(`http://${host}:${port}`)} - [ ${colors.white(`Route`)} ] ${colors.red(`${route.path}`)} - [ Method ] ${colors.red(` ${route.method} `)}`);
                    break;
            }
        });
    }
}