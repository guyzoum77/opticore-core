import {BaseRouterConfig} from "@/core/config/baseRouter.config";
import {TRouteConfigType} from "@/core/types/routeConfig.type";
import {IRouterConfig} from "@/core/interfaces/routerConfig.interface";

export class oPTMultipleRouter<TController, TAuthenticator> extends BaseRouterConfig<TController, TAuthenticator> {
    private routeConfigs: TRouteConfigType[];

    constructor(controller: new (...args: any[]) => TController,
                authenticator: { new(...args: any[]): TAuthenticator } | null,
                routeConfigs: TRouteConfigType[]) {
        super(controller, authenticator);
        this.routeConfigs = routeConfigs;
    }

    routes() {
        this.routeConfigs.forEach((route: TRouteConfigType): void => {
            const { path, method, handler, middlewares } = route;
            
            middlewares
                ? this.router[method](path, middlewares, handler)
                : this.router[method](path, handler);
        });

        return this.router;
    }
}