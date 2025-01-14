import {TRouteConfigHttpMethod} from "@/core/types/routeConfigHttpMethod.type";
import {NextFunction, RequestHandler} from "express";

export interface IMultipleRouterConfig<TContext> {
    path: string;
    method: TRouteConfigHttpMethod;
    middlewares: Array<(req: Request, res: Response, next: NextFunction) => void>;
    handler: (context: TContext) => Promise<void> | void;
}