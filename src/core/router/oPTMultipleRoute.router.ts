import {BaseRouterConfig} from "@/core/config/baseRouter.config";
import {TRouteConfigType} from "@/core/types/routeConfig.type";
import {Router} from "express";

export class oPTMultipleRouter<TController, TAuthenticator> extends BaseRouterConfig<TController, TAuthenticator> {
    private routeConfigs: TRouteConfigType[];

    constructor(controller: new (...args: any[]) => TController,
                authenticator: { new(...args: any[]): TAuthenticator } | null,
                routeConfigs: TRouteConfigType[]) {
        super(controller, authenticator);
        this.routeConfigs = routeConfigs;
    }

    routes() {
        this.routeConfigs.forEach((route: TRouteConfigType): void => {
            const { path, method, handler, authMiddleware } = route;

            // Check if authMiddleware is provided
            if (authMiddleware) {
                // Apply authMiddleware if it exists
                this.router[method](path, authMiddleware, handler);
            } else {
                // If no authMiddleware is provided, just use the handler
                this.router[method](path, handler);
            }
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}