import { Router, RequestHandler, Request, Response, NextFunction } from "express";
import { TRouteConfigHttpMethod } from "@/core/types/routeConfigHttpMethod.type";
import { IMultipleRouterConfig } from "@/core/interfaces/multipleRouterConfig.interface";
import { IMultipleRouteDefinition } from "@/core/interfaces/multipleRouteDefinition.interface";
import { TAuthenticatorFunction } from "@/core/types/authenticatorFunction.type";


export class oPTMultipleRouter<TContext> {
    private readonly router: Router;
    private routes: IMultipleRouterConfig<TContext>[];
    private controller: any;
    private readonly basePath: string;
    private readonly authenticator?: TAuthenticatorFunction<TContext>;

    constructor(controller: any, routes: IMultipleRouterConfig<TContext>[], authenticator?: TAuthenticatorFunction<TContext>) {
        this.router = Router();
        this.routes = routes;
        this.controller = controller;
        this.basePath = controller.basePath || '';
        this.authenticator = authenticator;
    }

    public getRoute(): IMultipleRouteDefinition {
        this.routes.forEach((route: IMultipleRouterConfig<TContext>): void => {
            const { path, method, middlewares, handler } = route;
            const fullPath: string = `${this.basePath}${path}`;

            // Wrap the handler to adapt to Express
            const expressHandler: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
                const context: TContext = { req, res, next } as unknown as TContext;
                handler(context);
            };

            if (this.authenticator) {
                const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
                    const context: TContext = { req, res, next } as unknown as TContext;
                    this.authenticator!(context)
                        ? next()
                        : res.status(401).send("Authentication failed");
                };

                this.router[method as TRouteConfigHttpMethod](fullPath, ...middlewares, authMiddleware, expressHandler);
            } else {
                this.router[method as TRouteConfigHttpMethod](fullPath, ...middlewares, expressHandler);
            }
        });

        return { path: this.basePath, handler: this.router };
    }
}