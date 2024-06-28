import {path} from "../../index";
import express from "express";

interface RouteLogged {
    [key: string]: boolean;
}
export class ExpressRoutesUtils {

    private defaultOptions = {
        prefix: '',
        spacer: 7,
        logger: console.info,
        color: true,
    };
    static getPathFromRegex(regexp: RegExp): string {
        return regexp
            .toString()
            .replace('/^', '')
            .replace('?(?=\\/|$)/i', '')
            .replace(/\\\//g, '/')
            .replace('(?:/(?=$))', '');
    }
    private combineStacks(acc: any, stack: any): any[] {
        if (stack.handle.stack) {
            const routerPath: string = ExpressRoutesUtils.getPathFromRegex(stack.regexp);
            return [...acc, ...stack.handle.stack.map((stack: any) => ({ routerPath, ...stack }))];
        }
        return [...acc, stack];
    }
    private getStacks(app: express.Application) {
        // Express 3
        if (app.routes) {
            // convert to express 4
            return Object.keys(app.routes).reduce(
                (acc: never[], method: string): any => [...acc, ...app.routes[method]], []
            ).map((route: any) => ({ route: { stack: [route] } }));
        }

        // Express 4
        if (app._router && app._router.stack) {
            return app._router.stack.reduce(this.combineStacks, []);
        }

        // Express 4 Router
        if (app.stack) {
            return app.stack.reduce(this.combineStacks, []);
        }

        // Express 5
        //  @ts-ignore
        if (app.router && app.router.stack) { // @ts-ignore
            return app.router.stack.reduce(this.combineStacks, []);
        }

        return [];
    }

    public expressListRoutes(app: express.Application, opts: any): any[] {
        const stacks = this.getStacks(app);
        const options = { ...this.defaultOptions, ...opts };
        const paths: any[] = [];

        if (stacks) {
            for (const stack of stacks) {
                if (stack.route) {
                    const routeLogged: RouteLogged = {};
                    for (const route of stack.route.stack) {
                        const method = route.method ? route.method.toUpperCase() : null;
                        if (!routeLogged[method] && method) {
                            const stackPath: string = path.normalize(
                                [
                                    options.prefix,
                                    stack.routerPath,
                                    stack.route.path,
                                    route.path
                                ].filter((s) => !!s).join('')
                            ).trim();
                            paths.push({ method, path: stackPath });
                            routeLogged[method] = true;
                        }
                    }
                }
            }
        }

        return paths;
    };
}