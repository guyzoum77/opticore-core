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
                console.log("Registering route path: ", path); // Log each registered route
                console.log("Registering route handler: ", handler.stack); // Log each registered route handler

                if (handler.stack) {
                    handler.stack.forEach((layer: any, index: number): void => {
                        console.log(`Layer path: ${layer.route?.path || 'N/A'}`);
                        console.log(`Layer methods: ${Object.keys(layer.route?.methods || {}).join(', ') || 'N/A'}`);

                        const routePath = layer.route?.path || "N/A";
                        const methods: string = Object.keys(layer.route?.methods || {}).join(", ");
                        console.log(`[${index}] Path: ${routePath}, Methods: ${methods}`);
                    });
                }

                this.router.use(path, handler);
            });
        });
    }
}