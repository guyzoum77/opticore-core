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

        // allFeatureRoutes.forEach(({ featureRoute }): void => {
        //     featureRoute.forEach(({ path, handler }): void => {
        //         handler.stack
        //             ? this.router.use(path, handler)
        //             : LogMessageUtils.error(
        //                 "Invalid handler",
        //                 "",
        //                 "",
        //                 `Handler at path ${path} does not contain a valid stack.`,
        //                 status.NOT_ACCEPTABLE
        //             );
        //
        //         handler.stack.forEach((layer: any, index: number): void => {
        //             const routePath = layer.route?.path || "N/A";
        //             const methods: string = Object.keys(layer.route?.methods || {}).join(", ");
        //             console.log(`Registering base route path: ${path}`);
        //             console.log(`[${index}] Sub-path: ${routePath}, Methods: ${methods}`);
        //         })
        //     });
        // });

        allFeatureRoutes.forEach(({ featureRoute }): void => {
            featureRoute.forEach(({ path, handler }): void => {
                if (handler.stack) {
                    this.router.use(path, handler);
                    registeredRoutes.push({ path: path, handler: handler });

                    handler.stack.forEach((layer: any, index: number, handler): void => {
                        const routePath = layer.route?.path || "N/A";
                        const methods: string = Object.keys(layer.route?.methods || {}).join(", ");
                        console.log("handler into handler.stack.forEach is : ", handler);

                        registeredRoutes.push(`[Layer ${index}] Sub-path: ${routePath}, Methods: ${methods}`);
                        registeredRoutes.push({ path: routePath, methods: methods });
                    });

                } else {
                    LogMessageUtils.error(
                        "Invalid handler",
                        "Router error",
                        "",
                        `Handler at path ${path} does not contain a valid stack.`,
                        status.NOT_ACCEPTABLE
                    );
                }
            });
        });

        return registeredRoutes;
    }
}