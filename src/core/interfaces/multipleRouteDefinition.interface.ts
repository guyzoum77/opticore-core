import { Router } from "express";

export interface IMultipleRouteDefinition {
    path: string;
    handler: Router;
}