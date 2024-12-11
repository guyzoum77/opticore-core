import { Request, Response, NextFunction } from "express";


export interface IRouterConfig {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: (req: Request, res: Response, next: NextFunction) => void;
    middleware?: boolean; // An Optional middleware to enable/passport.authenticate
}