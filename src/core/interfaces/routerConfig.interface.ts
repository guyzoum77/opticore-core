import { Request, Response, NextFunction } from "express";
import {TRouteConfigMethodType} from "@/core/types/routeConfigMethod.type";


export interface IRouterConfig {
    path: string;
    method: TRouteConfigMethodType;
    handler: (req: Request, res: Response, next: NextFunction) => void;
    middleware?: boolean;
}