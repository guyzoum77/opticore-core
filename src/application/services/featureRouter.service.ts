import express, {Router} from "express";

export class RouterService {
    public router = Router();

    constructor(app: Router) {
        this.router = app;
    }

    routesApps<T extends express.Router>(app: Router) {
        return [app];
    }
}