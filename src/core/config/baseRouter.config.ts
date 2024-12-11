import {Router} from "express";

export class BaseRouterConfig<T, U> {
    public router: Router;
    public controller: T;
    public middleware: U | null;


    constructor (TController: { new (): T }, UMiddleware?: { new (): U }) {
        this.router = Router();
        this.controller = new TController();
        this.middleware = UMiddleware
            ? new UMiddleware()
            : null;

        this.routes();
    }

    routes () {}
}