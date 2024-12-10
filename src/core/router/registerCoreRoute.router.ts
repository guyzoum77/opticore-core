import express from "express";
import {IRouteDefinition} from "@/core/interfaces/routeDefinition.interface";
import {LogMessageUtils} from "@/core/utils/logMessage.utils";
import {HttpStatusCodesConstant as status} from "@/domain/constants/httpStatusCodes.constant";

export class RegisterCoreRouteRouter {
    private router: express.Application;

    constructor(app: express.Application) {
        this.router = app;
    }


    /**
     * Dynamically register multiple routers.
     * @param allFeatureRoutes - Array of route definitions
     */
    registerRoutes(allFeatureRoutes: { featureRoute: IRouteDefinition[] }[]) {
        const registeredRoutes: any[] = [];

        allFeatureRoutes.forEach(({ featureRoute }): void => {
            featureRoute.forEach(({ path, handler }): void => {
                handler.stack
                    ? this.router.use(path, handler)
                    : LogMessageUtils.error(
                        "Invalid handler",
                        "",
                        "",
                        `Handler at path ${path} does not contain a valid stack.`,
                        status.NOT_ACCEPTABLE
                    );
                //registeredRoutes.push({path: path, handler: handler});
            });
        });

        //return registeredRoutes;
    }
}