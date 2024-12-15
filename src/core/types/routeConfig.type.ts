import { TRouteConfigHttpMethod } from "@/core/types/routeConfigHttpMethod.type";
import { RequestHandler } from "express";

export type TRouteConfigType<TController> = {
    path: string;
    method: TRouteConfigHttpMethod;
    middlewares?: RequestHandler[] | null;
    handler: keyof TController;
}