import express from "express";

export class RegisterCoreRouteRouter {
    private readonly router: express.Application = express();

    constructor(app: express.Application) {
        this.router = app;
    }

    routers (routes: express.Router[]): express.Router[] {
        return routes;
    }

    get routerApp() {
        return this.router;
    }
}