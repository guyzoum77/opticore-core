import express from "express";
import {BaseRouterConfig} from "@/core/config/baseRouter.config";
import {LogMessageUtils} from "@/core/utils/logMessage.utils";
import {HttpStatusCodesConstant as status} from "@/domain/constants/httpStatusCodes.constant";
import process from "node:process";


export class ControllerCoreRouteRouter<TController, TAuthenticator = null> extends BaseRouterConfig<TController, TAuthenticator> {
    constructor(
        controllerClass: new () => TController,
        authenticator?: new () => TAuthenticator | null
    ) {
        super(controllerClass, authenticator);
    }

    /**
     * Registers a route dynamically.
     *
     * @param method HTTP method (e.g., 'post', 'get', 'put', 'delete').
     * @param path Route path (e.g., '/create').
     * @param actionName Name of the controller action to invoke (e.g., 'create').
     * @param middleware Optional array of middleware functions.
     */
    action(
        method: "get" | "post" | "put" | "delete",
        path: string,
        actionName: keyof TController,
        middleware: express.RequestHandler[] = []
    ): void {
        this.router[method](path, ...middleware, async (req: express.Request, res: express.Response): Promise<void> => {
            const controllerInstance: TController = this.controller;

            if (typeof controllerInstance[actionName] === "function") {
                try {
                    await (controllerInstance[actionName] as any)(req, res);
                } catch (error: any) {
                    LogMessageUtils.error(
                        "Controller Instance Action Name",
                        "Controller error",
                        error.stack,
                        error.message,
                        status.INTERNAL_SERVER_ERROR,
                    );
                    res.status(500).json({ message: "Une erreur est survenue", error });
                }
            } else {
                LogMessageUtils.error(
                    "Controller Instance Action Name",
                    "Action name error",
                    `${process.cwd()} + /src/core/router/controllerCoreRoute.router.ts`,
                    "The Controller instance actionName is not a function",
                    status.NOT_ACCEPTABLE,
                );
                res.status(400).json({ message: `Action ${String(actionName)} introuvable` });
            }
        });
    }

    getRouter(): express.Router {
        return this.router;
    }
}