import {NextFunction} from "express";

export interface ICustomContext {
    req: Request;
    res: Response;
    next: NextFunction;
    session: { id: string; data: Record<string, unknown> };
    currentLocale: string;
}