import express from "express";

export class FeatureModuleCoreRouteRouter {
    private router: express.Application;

    constructor(app: express.Application) {
        this.router = app;
    }


    /**
     * Dynamically register API endpoints.
     * @param apis - Array of API definitions
     */
    endPointRoutes(apis: { path: string; handler: express.Router }[]): void {
        apis.forEach((api) => {
            this.router.use(api.path, api.handler);
        });
    }
}