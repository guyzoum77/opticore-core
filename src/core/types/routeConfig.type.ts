import {TRouteConfigMethodType} from "@/core/types/routeConfigMethod.type";
import express from "express";

export type TRouteConfigType = {
    path: string;
    method: TRouteConfigMethodType;
    middlewares?: express.RequestHandler[] | null;
    handler: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}