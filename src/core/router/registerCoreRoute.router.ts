import express from "express";
import {IRouteDefinition} from "@/core/interfaces/routeDefinition.interface";

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
                console.log(`Registering base route path: ${path}`);

                if (handler.stack) {
                    handler.stack.forEach((layer: any, index: number): void => {
                        const routePath = layer.route?.path || "N/A";
                        const methods: string = Object.keys(layer.route?.methods || {}).join(", ");
                        console.log(`[${index}] Sub-path: ${routePath}, Methods: ${methods}`);
                    });
                } else {
                    console.warn(`Handler at path ${path} does not contain a valid stack.`);
                }

                this.router.use(path, handler);
            });
        });
    }
}