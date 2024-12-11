import {Request, Response, NextFunction, Router} from "express";
import {IRouterConfig} from "@/core/interfaces/routerConfig.interface";
import passport, {AuthenticateOptions} from "passport";


export class OptControllerCoreRouter {
    private readonly router: Router;
    private routes: IRouterConfig[];

    constructor() {
        this.router = Router();
        this.routes = [];
    }

    public addRoute(
        method: 'get' | 'post' | 'put' | 'delete',
        path: string,
        handler: (req: Request, res: Response, next: NextFunction) => void,
        middleware: boolean = false // By default, middleware is not applied.
    ): void {
        this.routes.push({ path, method, handler, middleware });
    }

    // Method to configure all routes
    public routeConfigured(strategy: string, options: AuthenticateOptions): Router {
        this.routes.forEach((route: IRouterConfig): void => {
            const { path, method, handler, middleware } = route;
            if (middleware) {
                // If middleware is enabled, Strategy authentication is applied
                this.router[method](path, passport.authenticate(strategy, options), handler);
            } else {
                this.router[method](path, handler);
            }
        });

        return this.router;
    }
}