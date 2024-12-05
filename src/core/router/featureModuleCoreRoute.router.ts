import express from "express";

export class FeatureModuleCoreRouteRouter {
    public router: express.Application = express();

    constructor(app: express.Application) {
        this.router = app;
    }

    routesApp(router: express.Router[]): express.Router[] {
        return router;
    }
}