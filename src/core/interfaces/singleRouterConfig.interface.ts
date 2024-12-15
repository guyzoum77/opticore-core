import { Request, Response, NextFunction } from "express";
import {TRouteConfigHttpMethod} from "@/core/types/routeConfigHttpMethod.type";


export interface ISingleRouterConfig {
    path: string;
    method: TRouteConfigHttpMethod;
    handler: (req: Request, res: Response, next: NextFunction) => void;
    middleware?: boolean;
}