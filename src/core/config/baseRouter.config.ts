import {Router} from "express";

export class BaseRouterConfig<TController, TAuthenticator = null> {
    public router: Router;
    public controller: TController;
    public middleware: TAuthenticator | null;

    constructor(
        TController: { new(): TController },
        TAuthenticator?: { new(...args: any[]): (TAuthenticator | null) } | undefined
    ) {
        this.router = Router();
        this.controller = new TController();
        this.middleware = TAuthenticator ? new TAuthenticator() : null;
        this.routes();
    }

    routes(): void {}
}