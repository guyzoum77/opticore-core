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
                console.log(`Registering route path: ${path}`); // Log each registered route
                console.log(`Registering route handler: ${handler}`); // Log each registered route handler
                this.router.use(path, handler);
            });
        });
    }
}