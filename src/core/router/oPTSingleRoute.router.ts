import passport from "passport";
import { Request, Response, NextFunction, Router } from "express";
import { IRouterConfig} from "@/core/interfaces/routerConfig.interface";
import { IAuthPassportOptions } from "@/core/interfaces/authPassportOptions";
import { TRouteConfigMethodType } from "@/core/types/routeConfigMethod.type";


export class oPTSingleRouter {
    private readonly router: Router;
    private routes: IRouterConfig[];

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
    public route(method: TRouteConfigMethodType,
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
        this.routes.forEach((route: IRouterConfig): void => {
            const { path, method, handler, middleware } = route;

            middleware
                ? this.router[method](path, passport.authenticate(strategy, options), handler)
                : this.router[method](path, handler);
        });

        return this.router;
    }
}