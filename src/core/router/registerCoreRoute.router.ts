import express from "express";

export class RegisterCoreRouteRouter {
    private router: express.Application;

    constructor(app: express.Application) {
        this.router = app;
    }


    /**
     * Dynamically register multiple routers.
     * @param routes - Array of route definitions
     */
    registerRoutes(routes: { path: string; router: express.Router }[]): void {
        routes.forEach(route => {
            this.router.use(route.path, route.router);
        });
    }
}