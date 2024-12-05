import express from "express";

export class FeatureRouterService {
    public router: express.Application = express();

    constructor(app: express.Application) {
        this.router = app;
    }

    routerApp<T extends express.Router>(routers: T[]): T[] {
        return routers;
    }
}