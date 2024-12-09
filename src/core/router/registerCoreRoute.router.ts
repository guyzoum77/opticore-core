import express from "express";
import {IRouteDefinition} from "@/core/interfaces/routeDefinition.interface";
import {LogMessageUtils} from "@/core/utils/logMessage.utils";
import {HttpStatusCodesConstant as status} from "@/domain/constants/httpStatusCodes.constant";

export class RegisterCoreRouteRouter {
    private router: express.Application;

    constructor(app: express.Application) {
        this.router = app;
    }


    /**
     * Dynamically register multiple routers.
     * @param allFeatureRoutes - Array of route definitions
     */
    registerRoutes(allFeatureRoutes: { featureRoute: IRouteDefinition[] }[]): void {
        allFeatureRoutes.forEach(({ featureRoute }): void => {
            featureRoute.forEach(({ path, handler }): void => {
                handler.stack
                    ? this.router.use(path, handler)
                    : LogMessageUtils.error(
                        "Invalid handler",
                        "",
                        "",
                        `Handler at path ${path} does not contain a valid stack.`,
                        status.NOT_ACCEPTABLE
                    );

                handler.stack.forEach((layer: any, index: number): void => {
                    const routePath = layer.route?.path || "N/A";
                    const methods: string = Object.keys(layer.route?.methods || {}).join(", ");
                    console.log(`Registering base route path: ${path}`);
                    console.log(`[${index}] Sub-path: ${routePath}, Methods: ${methods}`);
                })
            });
        });
    }
}