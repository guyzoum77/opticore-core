import {BaseRouterConfig} from "@/core/config/baseRouter.config";
import express from "express";

export class ControllerCoreRouteRouter<TController, TAuthenticator> extends BaseRouterConfig<TController, TAuthenticator> {
    constructor(controllerClass: new () => TController, authenticator: TAuthenticator) {
        super(controllerClass, authenticator);
    }

    /**
     * Registers a route dynamically.
     * @param method HTTP method (e.g., 'post', 'get', 'put', 'delete').
     * @param path Route path (e.g., '/create').
     * @param actionName Name of the controller action to invoke (e.g., 'create').
     * @param middleware Optional array of middleware functions.
     */
    action(method: 'get' | 'post' | 'put' | 'delete', path: string, actionName: keyof TController, middleware: express.RequestHandler[] = []): void {
        this.router[method](path, ...middleware, async (req: express.Request, res: express.Response) => {
            const controllerInstance = new this.controller();
            if (typeof controllerInstance[actionName] === 'function') {
                try {
                    await (controllerInstance[actionName] as any)(req, res);
                } catch (error) {
                    res.status(500).json({ message: 'Une erreur est survenue', error });
                }
            } else {
                res.status(400).json({ message: `Action ${String(actionName)} introuvable` });
            }
        });
    }

    getRouter(): express.Router {
        return this.router;
    }
}