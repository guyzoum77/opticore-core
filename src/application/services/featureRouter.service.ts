import express, {Router} from "express";
import {IRoutes} from "@/core/interfaces/routes.interface";

export class RouterService implements IRoutes{
    public router = Router();

    constructor(app: Router) {
        this.router = app;
    }

    routesApps<T extends express.Router>(app: Router) {
        return [app];
    }
}