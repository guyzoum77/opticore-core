import {BaseRouterConfig} from "@/core/config/baseRouter.config";
import {TRouteConfigType} from "@/core/types/routeConfig.type";

export class OPTMultipleRouter<TController, TAuthenticator> extends BaseRouterConfig<TController, TAuthenticator> {
    private routeConfigs: TRouteConfigType[];

    constructor(controller: new (...args: any[]) => TController,
                authenticator: new (...args: any[]) => TAuthenticator | null,
                routeConfigs: TRouteConfigType[]) {
        super(controller, authenticator);
        this.routeConfigs = routeConfigs;
    }

    routes() {
        this.routeConfigs.forEach((routeConfig: TRouteConfigType): void => {
            const middlewares: any[] = routeConfig.middlewares || [];
            const handler = routeConfig.handler;

            // Dynamically apply route configurations
            (this.router as any)[routeConfig.method](routeConfig.path, ...middlewares, handler);
        });

        return this.router;
    }
}