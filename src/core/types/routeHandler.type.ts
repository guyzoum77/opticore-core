import {NextFunction} from "express";

export type TRouteHandler = (req: Request, res: Response, next: NextFunction) => void;