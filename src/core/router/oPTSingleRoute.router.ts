import passport from "passport";
import { Request, Response, NextFunction, Router } from "express";
import { IAuthPassportOptions } from "@/core/interfaces/authPassportOptions";
import { TRouteConfigHttpMethod } from "@/core/types/routeConfigHttpMethod.type";
import {ISingleRouterConfig} from "@/core/interfaces/singleRouterConfig.interface";


export class oPTSingleRouter {
    private readonly router: Router;
    private routes: ISingleRouterConfig[];

    constructor() {
        this.router = Router();
        this.routes = [];
    }

    /**
     *
     * @param method
     * @param path
     * @param handler
     * @param middleware  //By default, middleware is not applied.
     */
    public route(method: TRouteConfigHttpMethod,
                 path: string,
                 handler: (req: Request, res: Response, next: NextFunction) => void,
                 middleware: boolean = false
    ): void {
        this.routes.push({ path, method, handler, middleware });
    }

    /**
     * Method to configure all routes
     *
     * @param strategy
     * @param options
     */
    public getRoute(strategy: string, options: IAuthPassportOptions): Router {
        this.routes.forEach((route: ISingleRouterConfig): void => {
            const { path, method, handler, middleware } = route;

            middleware
                ? this.router[method](path, passport.authenticate(strategy, options), handler)
                : this.router[method](path, handler);
        });

        return this.router;
    }
}