import express from "express";

export class FeatureModuleCoreRouteRouter {
    private readonly router: express.Application = express();

    constructor(app: express.Application) {
        this.router = app;
    }

    routesApp(router: express.Router[]): express.Router[] {
        return router;
    }

    get routerAppExpress(): express.Application {
        return this.router;
    }
}