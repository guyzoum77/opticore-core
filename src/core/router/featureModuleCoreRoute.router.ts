import express from "express";

export class FeatureModuleCoreRouteRouter {
    private readonly router: express.Application = express();

    constructor(app: express.Application) {
        this.router = app;
    }

    appRouter(route: express.Router): express.Router {
        return route;
    }

    get routerApp(): express.Application {
        return this.router;
    }
}