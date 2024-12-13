import { TRouteConfigMethodType } from "@/core/types/routeConfigMethod.type";
import { Request, Response, NextFunction, RequestHandler } from "express";

export type TRouteConfigType = {
    path: string;
    method: TRouteConfigMethodType;
    middlewares?: RequestHandler[] | null;
    handler: (req: Request, res: Response, next: NextFunction) => void;
}