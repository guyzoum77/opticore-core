import express from "express";

/**
 * This is the register where we define all application routes.json.
 */
export default class RegisterRoute {
    public router: express.Application = express();

    constructor(app: express.Application) {
        this.router = app;
    }

    routers (): express.Router[] {
        return [];
    }
}