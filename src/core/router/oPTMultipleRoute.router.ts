import { Router } from "express";
import { BaseRouterConfig } from "@/core/config/baseRouter.config";
import { TRouteConfigType } from "@/core/types/routeConfig.type";
import { IRouteDefinition } from "@/core/interfaces/routeDefinition.interface";
import {LogMessageUtils} from "@/core/utils/logMessage.utils";
import { HttpStatusCodesConstant as status } from "@/domain/constants/httpStatusCodes.constant";
import process from "node:process";

export class oPTMultipleRouter<TController, TAuthenticator> extends BaseRouterConfig<TController, TAuthenticator> {
    private routeConfigs: TRouteConfigType[];
    private readonly controller: TController;
    private readonly basePath: string;

    constructor(basePath: string = "/",
                controller: new (...args: any[]) => TController,
                authenticator: { new (...args: any[]): TAuthenticator } | null,
                routeConfigs: TRouteConfigType[]) {
        super(controller, authenticator);
        this.basePath     = basePath;
        this.routeConfigs = routeConfigs;
        this.controller   = new controller();
    }

    routes(): IRouteDefinition[] {
        const router = Router();

        this.routeConfigs.forEach((route: TRouteConfigType): void => {
            const { path, method, handler, middlewares } = route;

            if (typeof this.controller[handler as keyof TController] !== "function") {
                LogMessageUtils.error(
                    "Handler",
                    "Handler not found",
                    process.cwd() + "/src/core/router/oPTMultipleRoute.router.ts",
                    `Handler ${String(handler)} does not exist on the controller.`,
                    status.NOT_FOUND
                );
                throw "";
            }

            const routeHandler = (this.controller[handler as keyof TController] as any).bind(this.controller);
            middlewares && middlewares.length > 0
                ? router[method](path, ...middlewares, routeHandler)
                : router[method](path, routeHandler);
        });

        return [{ path: this.basePath, handler: router }];
    }
}