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
    register(allFeatureRoutes: { featureRoute: IRouteDefinition[] }[]) {
        return allFeatureRoutes;
    }
}