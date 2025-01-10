import { Request, Response, NextFunction } from "express";
import {TRouteConfigHttpMethod} from "@/core/types/routeConfigHttpMethod.type";
import {TRouteHandler} from "@/core/types/routeHandler.type";


export interface ISingleRouterConfig {
    path: string;
    method: TRouteConfigHttpMethod;
    handler: TRouteHandler;
    middleware?: boolean;
}