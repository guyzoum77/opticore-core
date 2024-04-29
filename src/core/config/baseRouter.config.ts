import express from "express";


/**
 * BaseRouterConfig is a class taking in parameters
 * controller and optional middleware
 */
export class BaseRouterConfig<T, U> {
    public router: express.Router;
    public controller: T;
    public middleware: U;

    constructor (TController: new () => T, UMiddleware: new () => U) {
        this.router = express.Router();
        this.controller = new TController();
        this.middleware = new UMiddleware();

        this.routes();
    }

    routes () {}
}