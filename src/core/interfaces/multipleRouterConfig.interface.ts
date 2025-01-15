import {TRouteConfigHttpMethod} from "@/core/types/routeConfigHttpMethod.type";

export interface IMultipleRouterConfig<TContext> {
    path: string;
    method: TRouteConfigHttpMethod;
    middlewares: any[];
    handler: (context: TContext) => Promise<void> | void;
}